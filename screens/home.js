import React, {useState, useEffect} from 'react';
import {Dimensions, ActivityIndicator, Platform, Image} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout, Text, Button, Icon} from '@ui-kitten/components';
import {styles} from '../styles';
import LottieView from 'lottie-react-native';
import {formatPostForGame, shuffleArray} from '../api/post';
import {convertAsync} from 'react-native-video-cache';
import {RNFFmpeg} from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import logo from '../assets/logo.png';
import FastImage from 'react-native-fast-image';
import {defaultSeries} from '../util/defaultSeries';
import {getData, storeData} from '../util/storage';
import SplashScreen from 'react-native-splash-screen';

const screenHeight = Dimensions.get('window').height;

const StarIcon = props => <Icon {...props} name="info" />;
const ClockIcon = props => <Icon {...props} name="clock" />;
const SettingIcon = props => <Icon {...props} name="settings" />;

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(false);

  const getSettings = async () => {
    var settings = await getData('settings');
    if (!settings) {
      settings = {videoLimit: 20, timeLimit: 0, useTags: true, tags: defaultSeries};
      await storeData('settings', settings);
    }
    return settings;
  };

  const navigateQuiz = ({posts, settings}) => {
    const {videoLimit, timeLimit} = settings;
    navigation.navigate('Quiz', {posts, videoLimit, timeLimit});
  };

  const navigateScoreHistory = () => {
    navigation.navigate('ScoreHistory');
  };

  const navigateSettings = async () => {
    try {
      const settings = await getSettings();
      navigation.navigate('Settings', {...settings});
    } catch (error) {
      console.log('NAVIGATE_SETINGS_ERROR: ', error);
    }
  };

  const navigateAbout = () => {
    navigation.navigate('About');
  };

  const getPosts = async settings => {
    var tags = '';
    if (settings.tags && settings.tags.length > 0 && settings.useTags)
      tags = `${settings.tags[Math.floor(Math.random() * settings.tags.length)]}`;
    const posts = await formatPostForGame({tags});
    return posts;
  };

  const loadPost = async () => {
    try {
      if (loading) return;
      setError(false);
      setLoading(true);
      const settings = await getSettings();
      const post = await getPosts(settings);
      const post2 = await getPosts(settings);
      const posts = [post[0], post2[0]];
      const video_url = await convertAsync(posts[0].file_url);
      await fetch(video_url);
      if (posts[0].file_ext === 'webm' && Platform.OS === 'ios') {
        posts[0].file_url_mp4 = await convertToMP4(video_url, posts[0].id);
      }
      setLoading(false);
      navigateQuiz({posts, settings});
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log('ERROR_POSTS: ', error);
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

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Layout style={styles.animationBackground}>
        <LottieView
          style={{
            height: screenHeight,
          }}
          source={require('../assets/25114-background-slide.json')}
          autoPlay
          loop={true}
        />
      </Layout>

      <MotiView
        style={styles.center}
        from={{opacity: 0, translateY: -100}}
        animate={{opacity: 1, translateY: 0}}
        transition={{type: 'timing'}}>
        <Text category="h1" style={{marginBottom: 16}}>
          SAKUTRAIN
        </Text>
        <FastImage style={{width: 120, height: 120}} source={logo} resizeMode="contain" />
      </MotiView>
      <MotiView
        style={{width: '100%', ...styles.center}}
        from={{opacity: 0, translateY: screenHeight}}
        animate={{opacity: 1, translateY: screenHeight * 0.1}}
        transition={{type: 'timing'}}>
        <Layout
          style={{
            height: screenHeight * 0.35,
            width: '90%',
            justifyContent: loading ? 'flex-start' : 'space-between',
            backgroundColor: 'transparent',
          }}>
          <Button size="giant" onPress={loadPost}>
            {!err && (
              <Text category="h6" style={{fontWeight: '900'}}>
                {loading ? 'STARTING...' : 'START'}
              </Text>
            )}
            {err && (
              <Text category="h6" style={{fontWeight: '900'}}>
                TRY AGAIN
              </Text>
            )}
          </Button>
          {err && (
            <Layout style={{height: '100%', ...styles.center, backgroundColor: 'transparent'}}>
              <Text category="h6">An error ocurred, please try again :(</Text>
            </Layout>
          )}
          {loading && !err && (
            <Layout style={{height: '100%', ...styles.center, backgroundColor: 'transparent'}}>
              <ActivityIndicator color="#FAFAFA" />
            </Layout>
          )}
          {!loading && !err && (
            <Button appearance="ghost" accessoryLeft={ClockIcon} onPress={navigateScoreHistory}>
              <Text category="h6">HISTORY</Text>
            </Button>
          )}
          {!loading && !err && (
            <Button appearance="ghost" accessoryLeft={SettingIcon} onPress={navigateSettings}>
              <Text category="h6">SETTINGS</Text>
            </Button>
          )}
          {!loading && !err && (
            <Button appearance="ghost" accessoryLeft={StarIcon} onPress={navigateAbout}>
              <Text category="h6">ABOUT</Text>
            </Button>
          )}
        </Layout>
      </MotiView>
    </Layout>
  );
};
