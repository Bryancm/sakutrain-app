import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout} from '@ui-kitten/components';
import {styles} from '../styles';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const ConfettiLoader = ({complete, setComplete, limit, correct, wrong, posts, time, timeLimit, restartGame}) => {
  const navigaton = useNavigation();
  const navigateEndGame = () => {
    setTimeout(() => {
      setComplete(false);
      navigaton.navigate('EndGame', {limit, correct, wrong, posts, time, timeLimit, restartGame});
    }, 3250);
  };

  useEffect(() => {
    if (complete) navigateEndGame();
  }, [complete]);

  return (
    <AnimatePresence>
      {complete && (
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
              height: '32%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <LottieView
              style={{
                height: screenHeight * 0.2,
                width: screenWidth * 0.4,
                // transform: [{rotate: '135deg'}],
              }}
              source={require('../assets/lf30_editor_xxoqgysa.json')}
              autoPlay
              loop={true}
            />
          </Layout>
        </MotiView>
      )}
    </AnimatePresence>
  );
};
