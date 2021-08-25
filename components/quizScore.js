import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {View as MotiView} from 'moti';
import {Layout, Text, Icon} from '@ui-kitten/components';

const screenWidth = Dimensions.get('window').width;

const CloseIcon = props => <Icon {...props} name="close" />;
const CheckIcon = props => <Icon {...props} name="checkmark" />;

export const QuizScore = ({wrong, correct}) => {
  return (
    <MotiView
      style={{
        position: 'absolute',
        paddingVertical: 20,
        flexDirection: 'row',
      }}
      from={{opacity: 0, translateX: screenWidth}}
      animate={{opacity: 1, translateX: screenWidth * 0.32}}
      transition={{type: 'timing', delay: 300}}>
      <Layout
        style={{
          flexDirection: 'row',
          marginRight: 12,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CloseIcon style={{width: 30, height: 30, marginRight: 4}} fill="#E40017" />
        <Text category="h6" status="primary">
          {wrong}
        </Text>
      </Layout>
      <Layout
        style={{
          flexDirection: 'row',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CheckIcon style={{width: 30, height: 30, marginRight: 4}} fill="#6FCF79" />
        <Text category="h6" status="success">
          {correct}
        </Text>
      </Layout>
    </MotiView>
  );
};
