import React from 'react';
import {Dimensions, ActivityIndicator, Alert} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout, Text, Icon, Button} from '@ui-kitten/components';
import {styles} from '../styles';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PlayCircle = props => <Icon {...props} name="play-circle" />;
const BackIcon = props => <Icon {...props} name="arrow-circle-left" />;
const RestartIcon = props => <Icon {...props} name="refresh-outline" />;

export const EndGameMenu = ({gameIsPaused, pauseGame, restartGame, loading}) => {
  const navigaton = useNavigation();
  const navigateBack = () => {
    navigaton.goBack();
  };
  const restartAlert = () =>
    Alert.alert('RESTART', 'do you want to restart the game ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: restartGame},
    ]);
  const goBackAlert = () =>
    Alert.alert('GO TO MENU', 'All progress will be LOST, do you want to continue ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: navigateBack, style: 'destructive'},
    ]);
  return (
    <AnimatePresence>
      {gameIsPaused && (
        <MotiView
          style={{
            position: 'absolute',
            width: '100%',
            height: '115%',
            zIndex: 20,
            ...styles.center,
          }}
          from={{opacity: 0, translateY: screenHeight, backgroundColor: 'rgba(0,0,0,0)'}}
          animate={{opacity: 1, translateY: -50, backgroundColor: 'rgba(0,0,0,0.4)'}}
          exit={{
            opacity: 0,
            translateY: screenHeight,
            backgroundColor: 'rgba(0,0,0,0)',
          }}
          transition={{
            type: 'timing',
            delay: 0,
            backgroundColor: {
              type: 'timing',
              delay: 300,
            },
          }}
          exitTransition={{
            type: 'timing',
            delay: 300,
            backgroundColor: {
              type: 'timing',
              delay: 0,
            },
          }}>
          <Layout
            style={{
              width: '70%',
              height: loading ? '14%' : '32%',
              ...styles.image,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text style={{marginVertical: 16}} category="h5" status="basic">
              {loading ? 'RESTARTING...' : 'PAUSED'}
            </Text>
            {loading && <ActivityIndicator />}
            {!loading && (
              <Button
                size="giant"
                style={{width: '100%', justifyContent: 'space-between', alignItems: 'center'}}
                appearance="ghost"
                onPress={restartAlert}
                accessoryRight={RestartIcon}>
                {<Text category="h6">RESTART</Text>}
              </Button>
            )}
            {!loading && (
              <Button
                size="giant"
                style={{width: '100%', justifyContent: 'space-between', alignItems: 'center'}}
                appearance="ghost"
                onPress={goBackAlert}
                accessoryRight={BackIcon}>
                <Text category="h6">MENU</Text>
              </Button>
            )}
            {!loading && (
              <Button
                size="giant"
                style={{width: '100%', justifyContent: 'space-between', alignItems: 'center'}}
                appearance="ghost"
                onPress={pauseGame}
                accessoryRight={PlayCircle}>
                <Text category="h6">RESUME</Text>
              </Button>
            )}
          </Layout>
        </MotiView>
      )}
    </AnimatePresence>
  );
};
