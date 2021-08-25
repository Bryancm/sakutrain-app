import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, SafeAreaView, ActivityIndicator, Platform, BackHandler, Alert} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout, Text, Button} from '@ui-kitten/components';
import {calculateAspectRatioFit} from '../util/size';
import {styles} from '../styles';
import convertProxyUrl, {convertAsync} from 'react-native-video-cache';
import VideoPlayer from 'react-native-video-controls';
import {RNFFmpeg} from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import {PauseButton} from '../components/pauseButton';
import {Timer} from '../components/timer';
import {QuizScore} from '../components/quizScore';
import {PauseMenu} from '../components/pauseMenu';
import {TimeIsUp} from '../components/timeIsUp';
import {ConfettiLoader} from '../components/confettiLoader';
import {formatPostForGame, shuffleArray} from '../api/post';
import {getData, storeData} from '../util/storage';
import {cleanCache} from '../util/cache';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const QuizScreen = ({navigation, route}) => {
  var abortController = false;

  const data = route.params.posts;
  const vl = route.params.videoLimit;

  const video = useRef();
  const [limit, setLimit] = useState(vl);
  const [timeLimit, setTimeLimit] = useState(route.params.timeLimit);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [converting, setConverting] = useState(false);
  const [index, setIndex] = useState(0);
  const [posts, setPosts] = useState(data);
  const [selected, setSelected] = useState('');
  const [post, setPost] = useState(data[0]);
  const [answer, setAsnwer] = useState(data[0].artists[0]);
  const [options, setOptions] = useState(data[0].options);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [count, setCount] = useState(0);
  const [gameIsPaused, setGameIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(1);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [complete, setComplete] = useState(false);
  const [viewedPosts, setViewedPosts] = useState([]);
  const [time, setTime] = useState(timeLimit);

  const sizeStyle = calculateAspectRatioFit(post.width, post.height, screenWidth * 0.97, 265);
  const getSettings = async () => {
    var settings = await getData('settings');
    if (!settings) {
      settings = {videoLimit: 20, timeLimit: 0, useTags: true, tags: defaultSeries};
      await storeData('settings', settings);
    }
    return settings;
  };

  const getPosts = async settings => {
    var tags = '';
    if (settings.tags && settings.tags.length > 0 && settings.useTags)
      tags = `${settings.tags[Math.floor(Math.random() * settings.tags.length)]}`;
    const p = await formatPostForGame({tags});
    return p;
  };

  const restartGame = async () => {
    try {
      setLoading(true);
      setLoadingButton(true);
      const settings = await getSettings();
      const post = await getPosts(settings);
      const post2 = await getPosts(settings);
      const posts = [post[0], post2[0]];

      const video_url = await convertAsync(posts[0].file_url);
      await fetch(video_url);
      if (posts[0].file_ext === 'webm' && Platform.OS === 'ios') {
        posts[0].file_url_mp4 = await convertToMP4(video_url, posts[0].id);
      }

      setConverting(false);
      setIndex(0);
      setPosts(posts);
      setSelected('');
      setPost(posts[0]);
      setAsnwer(posts[0].artists[0]);
      setOptions(posts[0].options);
      setViewedPosts([]);
      setCorrect(0);
      setWrong(0);
      setCount(1);
      setLimit(limit);
      setTimeLimit(timeLimit);
      setTime(timeLimit);
      setTimerKey(pk => pk + 1);
      setGameIsPaused(false);
      setLoading(false);
      setLoadingButton(false);
    } catch (error) {
      console.log('ERROR_POSTS: ', error);
    }
  };

  const pauseGame = () => {
    setGameIsPaused(!gameIsPaused);
  };

  const getNextPosts = async () => {
    var newPosts = [...posts];
    const complete = count === limit;
    if (!complete) {
      const settings = await getSettings();
      var fetchedPosts = await getPosts(settings);

      if (fetchedPosts.length === 0) fetchedPosts = await getPosts(settings);
      if (fetchedPosts.length === 0) fetchedPosts = await getPosts(settings);

      newPosts.push(fetchedPosts[0]);
      setPosts(newPosts);
    }
    return newPosts;
  };

  const loadNextVideo = async index => {
    try {
      await cleanCache();
      const posts = await getNextPosts();
      const post = posts[index];
      if (abortController) abortController.abort();
      abortController = new AbortController();
      const isWebm = post.file_ext === 'webm' && Platform.OS === 'ios';
      if (isWebm) setConverting(post.id);
      video.current && video.current.methods.clearError();
      const video_url = await convertAsync(post.file_url);
      await fetch(video_url, {signal: abortController.signal});
      if (isWebm) {
        post.file_url_mp4 = await convertToMP4(video_url, post.id);
        const newPosts = [...posts];
        newPosts[index] = post;
        setPosts(newPosts);
        setConverting(false);
      }
    } catch (error) {
      setConverting(false);
      console.log('LOAD_NEXT_VIDEO_ERROR: ', error);
    }
  };

  const convertToMP4 = async (url, id) => {
    try {
      const directory = `${RNFS.CachesDirectoryPath}/webmCache`;
      const exist = await RNFS.exists(directory);
      if (exist) await RNFS.unlink(directory);
      await RNFS.mkdir(directory);
      const fileName = `${directory}/${id}.mp4`;
      const command = `-i ${url} -strict experimental ${fileName}`;
      await RNFFmpeg.execute(command);
      return fileName;
    } catch (error) {
      console.log('CONVERT_TO_MP4_ERROR: ', error);
    }
  };

  const selectOption = async option => {
    if (selected) return;

    setSelected(option);
    const currentPost = post;
    const complete = count === limit;
    currentPost.selected = option;
    setViewedPosts([...viewedPosts, currentPost]);
    if (option === answer) setCorrect(correct + 1);
    if (option !== answer) setWrong(wrong + 1);
    setComplete(complete);
    if (complete) pauseGame();

    if (!complete) {
      setTimeout(() => {
        setLoadingButton(true);
        setTimeout(() => {
          setLoading(true);
          setIndex(index + 1);
          const nextPost = posts[index + 1];
          setPost(nextPost);
          setAsnwer(nextPost.artists[0]);
          setOptions(nextPost.options);
        }, 500);
        setTimeout(() => {
          setSelected('');
          setLoading(false);
          setLoadingButton(false);
        }, 2000);
      }, 1500);
    }
  };

  const buttonStatus = option => {
    if (!selected) return 'info';
    if (selected === option && option !== answer) return 'primary';
    if (option !== answer) return 'info';
    if (option === answer) return 'success';
  };

  const mapOptions = (o, i) => {
    return (
      <AnimatePresence key={i}>
        {!loadingButton && (
          <MotiView
            style={{borderRadius: 3, zIndex: 10}}
            from={{opacity: 0, translateX: -screenWidth}}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
            exit={{opacity: 0, translateX: -screenWidth}}
            transition={{
              type: 'timing',
              delay: i * 100,
              translateX: {
                type: 'spring',
                damping: 18,
                stiffness: 250,
              },
            }}>
            <Button status={buttonStatus(o)} appearance="filled" size="large" onPress={() => selectOption(o)}>
              <Text category="h6">{o}</Text>
            </Button>
          </MotiView>
        )}
      </AnimatePresence>
    );
  };

  useEffect(() => {
    setCount(count + 1);
    loadNextVideo(index + 1);
  }, [post]);

  const navigateBack = () => {
    navigation.popToTop();
  };

  const goBackAlert = () =>
    Alert.alert('GO BACK TO HOME', 'All progress will be LOST, do you want to continue ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: navigateBack, style: 'destructive'},
    ]);

  useEffect(() => {
    const backAction = () => {
      goBackAlert();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const isVideo =
    post.file_ext !== 'gif' && post.file_ext !== 'jpg' && post.file_ext !== 'jpeg' && post.file_ext !== 'png';

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Layout
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <PauseButton count={count} limit={limit} pauseGame={pauseGame} />

          <Timer
            timeLimit={timeLimit}
            timerKey={timerKey}
            gameIsPaused={gameIsPaused}
            setTimeIsUp={setTimeIsUp}
            time={time}
            setTime={setTime}
          />

          <QuizScore correct={correct} wrong={wrong} />
          <PauseMenu
            gameIsPaused={gameIsPaused}
            pauseGame={pauseGame}
            restartGame={restartGame}
            loading={loading}
            complete={complete}
          />
          {timeLimit > 0 && (
            <TimeIsUp
              timeIsUp={timeIsUp}
              setTimeIsUp={setTimeIsUp}
              pauseGame={pauseGame}
              posts={viewedPosts}
              limit={limit}
              correct={correct}
              wrong={wrong}
              time={time}
              timeLimit={timeLimit}
              restartGame={restartGame}
            />
          )}
          <ConfettiLoader
            complete={complete}
            setComplete={setComplete}
            pauseGame={pauseGame}
            posts={viewedPosts}
            limit={limit}
            correct={correct}
            wrong={wrong}
            time={time}
            timeLimit={timeLimit}
            restartGame={restartGame}
          />

          <AnimatePresence>
            {!loading && (
              <MotiView
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                from={{opacity: 0, translateY: -300}}
                animate={{opacity: 1, translateY: 90}}
                exit={{opacity: 0, translateY: -300}}
                transition={{
                  type: 'timing',
                  translateY: {
                    type: 'spring',
                    damping: 15,
                    stiffness: 150,
                  },
                }}>
                <Layout style={{...styles.image, ...sizeStyle, backgroundColor: '#FAFAFA', ...styles.center}}>
                  {converting === post.id && (
                    <Layout
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000000',
                        ...styles.shadowRounded,
                        ...styles.center,
                      }}>
                      <ActivityIndicator />
                    </Layout>
                  )}
                  {!isVideo && (
                    <FastImage
                      source={{uri: post.file_url}}
                      style={{width: '100%', height: '100%', ...styles.shadowRounded}}
                      resizeMode="contain"
                    />
                  )}

                  {converting !== post.id && isVideo && (
                    <VideoPlayer
                      ref={video}
                      paused={gameIsPaused}
                      style={{...styles.shadowRounded, width: '100%', height: '100%'}}
                      videoStyle={{width: '100%', height: '100%'}}
                      repeat={true}
                      muted={true}
                      source={{uri: post.file_url_mp4 ? post.file_url_mp4 : convertProxyUrl(post.file_url)}}
                      progressUpdateInterval={1000}
                      resizeMode="stretch"
                      disableFullscreen
                      disableVolume
                      disableBack
                      scrubbing={1}
                      controlAnimationTiming={250}
                      controlTimeout={1000}
                      showOnStart={true}
                    />
                  )}
                </Layout>
              </MotiView>
            )}
          </AnimatePresence>
          <Layout
            style={{
              width: '100%',
              transform: [{translateY: 130}],
              ...styles.center,
            }}>
            <Layout
              style={{
                height: screenHeight * 0.4,
                width: '92%',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
              }}>
              {options.map(mapOptions)}
            </Layout>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};
