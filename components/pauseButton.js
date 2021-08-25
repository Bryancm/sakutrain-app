import React from 'react';
import {Dimensions} from 'react-native';
import {View as MotiView} from 'moti';
import {Layout, Text, Icon, Button} from '@ui-kitten/components';

const screenWidth = Dimensions.get('window').width;

const PauseCircle = props => (
  <Icon name="pause-circle-outline" style={{width: 30, height: 30, marginRight: 12}} fill="#F5F5F5" />
);

export const PauseButton = ({count, limit, pauseGame}) => {
  return (
    <MotiView
      style={{position: 'absolute', paddingVertical: 20, flexDirection: 'row'}}
      from={{opacity: 0, translateX: -screenWidth * 0.6}}
      animate={{opacity: 1, translateX: -screenWidth * 0.33}}
      exit={{
        opacity: 0,
        translateX: -screenWidth * 0.6,
      }}
      transition={{
        type: 'timing',
        delay: 300,
      }}>
      <Button
        style={{paddingHorizontal: 0, paddingVertical: 0, marginHorizontal: 0, marginVertical: 0}}
        size="tiny"
        appearance="ghost"
        accessoryRight={PauseCircle}
        onPress={pauseGame}
      />
      <Layout
        style={{
          flexDirection: 'row',
          marginRight: 12,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text category="h6" status="basic">
          {`${count} / ${limit}`}
        </Text>
      </Layout>
    </MotiView>
  );
};
