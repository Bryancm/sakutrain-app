import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Platform, ActivityIndicator} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout, Text, Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {styles} from '../styles';
import {useNavigation} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {PostList} from '../components/postList';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {formatDate} from '../util/date';
import {getData, storeData} from '../util/storage';
import infinity from '../assets/infinite.png';
import FastImage from 'react-native-fast-image';

const RestartIcon = props => <Icon {...props} name="refresh-outline" />;
const HomeIcon = props => <Icon {...props} name="home-outline" />;
const ShareIcon = props => <Icon {...props} name="share" />;
const ShareIconIOS = props => (
  <Icon style={{width: 25, height: 25, transform: [{rotate: '-90deg'}]}} fill="#FAFAFA" name="log-out" />
);
const CloseIcon = props => <Icon {...props} name="close" />;
const CheckIcon = props => <Icon {...props} name="checkmark" />;
const ClockIcon = props => <Icon {...props} name="clock-outline" />;
const HashIcon = props => <Icon {...props} name="play-circle-outline" />;
const BackIcon = props => <Icon {...props} name="close" />;

export const EndGameScreen = ({route}) => {
  const restartGame = route.params.restartGame;
  const viewShot = useRef();
  const limit = route.params.limit;
  const correct = route.params.correct;
  const wrong = route.params.wrong;
  const time = route.params.timeLimit ? route.params.timeLimit - route.params.time : route.params.time;
  const posts = route.params.posts;
  const date = route.params.date ? route.params.date : new Date();
  const id = route.params.id ? route.params.id : date.valueOf();

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const saveScore = async () => {
    try {
      const score = {id, date, limit, correct, wrong, time, posts};
      var newScores = [score];
      var exist = false;
      const scores = await getData('scores');
      if (scores) {
        const filteredscores = scores.filter(s => s.id !== score.id);
        exist = scores.filter(s => s.id === score.id)[0];
        newScores = [score, ...filteredscores];
      }

      if (!exist) await storeData('scores', newScores);
    } catch (error) {
      console.log('SAVE_SCORE: ', error);
    }
  };

  useEffect(() => {
    saveScore();
  }, []);

  useEffect(() => {
    if (toast) setTimeout(() => setToast(''), 1500);
  }, [toast]);

  const restart = () => {
    restartGame();
    navigation.goBack();
  };

  const navigateHome = () => {
    navigation.goBack();
    navigation.goBack();
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const share = async () => {
    try {
      setLoading(true);
      const uri = await viewShot.current.capture();
      const res = await RNFS.readFile(uri, 'base64');
      const percent = Math.round((correct / limit) * 100);
      let urlString = 'data:image/jpeg;base64,' + res;
      let options = {
        title: 'Sakutrain Score',
        message: `SAKUTRAIN SCORE ${percent}%  \n wrong = ${wrong} \n correct = ${correct} \n total = ${limit} \n time = ${time}s`,
        url: urlString,
        type: 'image/jpeg',
      };
      await Share.open(options);
      setLoading(false);
    } catch (error) {
      console.log('SHARE_ERROR: ', error);
      setLoading(false);
    }
  };

  const ShareButton = () =>
    Platform.OS === 'ios' ? (
      <TopNavigationAction icon={ShareIconIOS} onPress={share} />
    ) : (
      <TopNavigationAction icon={ShareIcon} onPress={share} />
    );

  const accessoryLeft = () => (
    <>
      {restartGame && <TopNavigationAction icon={HomeIcon} onPress={navigateHome} />}
      {restartGame && <TopNavigationAction icon={RestartIcon} onPress={restart} />}
      {!restartGame && <TopNavigationAction icon={BackIcon} onPress={navigateBack} />}
    </>
  );

  const shareLoading = () => (
    <>
      <ActivityIndicator color="#FAFAFA" />
    </>
  );

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ViewShot ref={viewShot} style={{flex: 1, backgroundColor: '#051338'}} options={{format: 'jpg', quality: 1}}>
          <AnimatePresence>
            {toast && (
              <MotiView
                pointerEvents="box-none"
                style={{width: '100%', height: '100%', ...styles.center, position: 'absolute', zIndex: 20}}
                from={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{type: 'timing'}}>
                <Layout level="2" style={{borderRadius: 4, padding: 8}}>
                  <Text category="s1">{toast}</Text>
                </Layout>
              </MotiView>
            )}
          </AnimatePresence>
          <MotiView
            from={{opacity: 0, translateY: -100}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'timing', delay: 300}}>
            <TopNavigation
              title="Score"
              subtitle={formatDate(date)}
              alignment="center"
              accessoryLeft={accessoryLeft}
              accessoryRight={loading ? shareLoading : ShareButton}
            />
          </MotiView>

          <MotiView
            style={styles.center}
            from={{opacity: 0, translateY: -100}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'timing'}}>
            <AnimatedCircularProgress
              fill={(correct / limit) * 100}
              size={160}
              width={15}
              duration={2000}
              padding={0}
              lineCap="round"
              tintColor="#F9B208"
              tintColorSecondary="#6FCF79"
              backgroundColor="#FAFAFA">
              {fill => <Text category="h2">{`${Math.round(fill)}%`}</Text>}
            </AnimatedCircularProgress>
          </MotiView>

          <MotiView from={{opacity: 0}} animate={{opacity: 1}} transition={{type: 'timing', delay: 300, duration: 500}}>
            <Layout
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingVertical: 16,
              }}>
              <Layout style={styles.scoreIcons}>
                <CloseIcon style={{width: 38, height: 38, marginRight: 4}} fill="#E40017" />
                <Text category="h6" status="primary">
                  {wrong}
                </Text>
              </Layout>
              <Layout style={styles.scoreIcons}>
                <CheckIcon style={{width: 38, height: 38, marginRight: 4}} fill="#6FCF79" />
                <Text category="h6" status="success">
                  {correct}
                </Text>
              </Layout>
              <Layout style={styles.scoreIcons}>
                <HashIcon style={{width: 30, height: 30, marginRight: 4}} fill="#FAFAFA" />
                <Text category="h6">{limit}</Text>
              </Layout>
              <Layout style={styles.scoreIcons}>
                <ClockIcon style={{width: 30, height: 30, marginRight: 4}} fill="#FAFAFA" />
                {time === 0 ? (
                  <FastImage source={infinity} style={{width: 30, height: 30}} />
                ) : (
                  <Text category="h6">{`${time}s`}</Text>
                )}
              </Layout>
            </Layout>
          </MotiView>

          <PostList posts={posts} setToast={setToast} />
        </ViewShot>
      </SafeAreaView>
    </Layout>
  );
};
