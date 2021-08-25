import React from 'react';
import {Animated} from 'react-native';
import {View as MotiView} from 'moti';
import {Layout, Text} from '@ui-kitten/components';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import infinity from '../assets/loop.png';
import FastImage from 'react-native-fast-image';

export const Timer = ({timeLimit, timerKey, gameIsPaused, setTimeIsUp, time, setTime}) => {
  const onComplete = () => {
    setTimeIsUp(true);
  };

  const renderAriaTime = ({remainingTime}) => {
    if (remainingTime !== time) setTime(remainingTime);
    return '';
  };

  return (
    <MotiView
      style={{
        position: 'absolute',
        paddingVertical: 20,
        flexDirection: 'row',
      }}
      from={{opacity: 0, translateY: -300}}
      animate={{opacity: 1, translateY: -5.5}}
      transition={{type: 'timing', delay: 300}}>
      <Layout
        style={{
          flexDirection: 'row',
          marginRight: 12,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {timeLimit === 0 ? (
          <FastImage source={infinity} style={{width: 55, height: 55}} />
        ) : (
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={!gameIsPaused}
            duration={timeLimit}
            onComplete={onComplete}
            renderAriaTime={renderAriaTime}
            size={50}
            strokeWidth={4}
            trailColor="#F5F5F5"
            colors={[
              ['#6FCF79', 0.4],
              ['#FFE500', 0.4],
              ['#E40017', 0.2],
            ]}>
            {({remainingTime, animatedColor}) => (
              <Animated.Text style={{color: animatedColor, fontSize: 18, fontWeight: '900'}}>
                {remainingTime}
              </Animated.Text>
            )}
          </CountdownCircleTimer>
        )}
      </Layout>
    </MotiView>
  );
};
