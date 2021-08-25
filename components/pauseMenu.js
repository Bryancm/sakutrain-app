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

export const PauseMenu = ({gameIsPaused, pauseGame, restartGame, loading, complete}) => {
  const navigaton = useNavigation();
  const navigateBack = () => {
    navigaton.goBack();
  };
  const restartAlert = () =>
    Alert.alert('RESTART', 'All progress will be LOST, do you want to continue ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: restartGame, style: 'destructive'},
    ]);

  const goBackAlert = () =>
    Alert.alert('GO BACK TO HOME', 'All progress will be LOST, do you want to continue ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: navigateBack, style: 'destructive'},
    ]);

  return (
    <AnimatePresence>
      {gameIsPaused && !complete && (
        <MotiView
          style={{
            position: 'absolute',
            width: '100%',
            height: '115%',
            zIndex: 20,
            ...styles.center,
          }}
          from={{opacity: 0, translateY: screenHeight, backgroundColor: 'rgba(0,0,0,0)'}}
          animate={{opacity: 1, translateY: -50, backgroundColor: loading ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.4)'}}
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
            style={
              loading
                ? {
                    width: '70%',
                    height: loading ? '14%' : '32%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: '#051338',
                  }
                : {
                    width: '70%',
                    height: loading ? '14%' : '32%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: '#0D1B4E',
                    ...styles.image,
                  }
            }>
            <Text style={{marginVertical: 16}} category="h5">
              {loading ? 'RESTARTING...' : 'PAUSED'}
            </Text>
            {loading && <ActivityIndicator color="#FAFAFA" />}
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
                <Text category="h6">HOME</Text>
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
