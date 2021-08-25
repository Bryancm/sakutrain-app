import React, {useEffect, useState} from 'react';
import {SafeAreaView, ActivityIndicator, Alert} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout, TopNavigation, TopNavigationAction, Icon, Text} from '@ui-kitten/components';
import {ScoreList} from '../components/scoreList';
import {styles} from '../styles';
import {getData, storeData, removeData} from '../util/storage';

const BackIcon = props => <Icon {...props} name="arrow-back-outline" />;
const TrashIcon = props => <Icon {...props} name="trash-2-outline" />;

export const ScoreHistoryScreen = ({navigation}) => {
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState([]);

  const navigateBack = () => {
    navigation.goBack();
  };

  const getScoreHistory = async () => {
    try {
      const s = await getData('scores');
      if (s) setScores(s);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('GET_SCORE_ERROR: ', error);
    }
  };

  useEffect(() => {
    getScoreHistory();
  }, []);

  useEffect(() => {
    if (toast) setTimeout(() => setToast(''), 1500);
  }, [toast]);

  const clearScores = async () => {
    try {
      // setLoading(true);
      await removeData('scores');
      setLoading(false);
      setScores([]);
      setToast('Score list cleared');
    } catch (error) {
      setLoading(false);
      console.log('CLEAR_SCORES_ERROR: ', error);
    }
  };

  const removeScore = async id => {
    try {
      // setLoading(true);
      const items = await getData('scores');
      const newItems = items.filter(i => i.id !== id);
      await storeData('scores', newItems);
      setScores(newItems);
      setLoading(false);
      setToast('Score removed');
    } catch (error) {
      setLoading(false);
      console.log('REMOVE_SCORES_ERROR: ', error);
    }
  };

  const clearAlert = async () => {
    const scores = await getData('scores');
    if (scores) {
      Alert.alert('Remove all', `Do you want to clear your score list ?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Confirm', onPress: clearScores, style: 'destructive'},
      ]);
    } else {
      Alert.alert(`The scores list is alerady empty`);
    }
  };

  const alertRemove = item =>
    Alert.alert('Remove', `Do you want to remove this score from your scores ?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () => removeScore(item.id), style: 'destructive'},
    ]);

  const accessoryLeft = () => (
    <>
      <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    </>
  );

  const accessoryRight = () => (
    <>
      <TopNavigationAction icon={TrashIcon} onPress={clearAlert} />
    </>
  );

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
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
          transition={{type: 'timing', delay: 0}}>
          <TopNavigation
            title="Score History"
            alignment="center"
            accessoryLeft={accessoryLeft}
            accessoryRight={accessoryRight}
          />
        </MotiView>
        {loading ? (
          <Layout style={{flex: 1, ...styles.center}}>
            <ActivityIndicator />
          </Layout>
        ) : (
          <ScoreList scores={scores} alertRemove={alertRemove} />
        )}
      </SafeAreaView>
    </Layout>
  );
};
