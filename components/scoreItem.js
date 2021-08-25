import React, {useState} from 'react';
import {Dimensions, Linking, TouchableOpacity} from 'react-native';
import {Layout, Text, Icon, Button, OverflowMenu, MenuItem} from '@ui-kitten/components';
import {View as MotiView, AnimatePresence} from 'moti';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {styles} from '../styles';
import FastImage from 'react-native-fast-image';
import Clipboard from '@react-native-community/clipboard';
import {formatDate} from '../util/date';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CloseIcon = props => <Icon {...props} name="close" />;
const CheckIcon = props => <Icon {...props} name="checkmark" />;
const HashIcon = props => <Icon {...props} name="play-circle-outline" />;
const ClockIcon = props => <Icon {...props} name="clock-outline" />;
const ExternalLink = props => <Icon {...props} name="external-link-outline" />;
const LinkIcon = props => <Icon {...props} name="link-2-outline" />;
const TagIcon = props => <Icon {...props} name="pricetags-outline" />;
const MoreIcon = props => <Icon {...props} name="trash-2-outline" />;
const TrashIcon = props => <Icon {...props} name="trash-2-outline" />;

export const ScoreItem = ({item, index, alertRemove}) => {
  const {correct, wrong, limit, time, date, posts, id} = item;
  const navigaton = useNavigation();
  const navigateEndGame = () => {
    navigaton.navigate('EndGame', {limit, correct, wrong, posts, time, id, date});
  };
  const remove = () => alertRemove(item);
  return (
    <AnimatePresence>
      <MotiView
        from={{opacity: 0, translateX: screenHeight}}
        animate={{opacity: 1, translateX: 0}}
        exit={{opacity: 0, translateX: screenHeight}}
        transition={{
          type: 'timing',
          delay: index * 100,
          translateX: {
            type: 'spring',
            damping: 18,
            stiffness: 250,
          },
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={navigateEndGame}
          style={{alignItems: 'center', width: '100%', height: 100, marginVertical: 8}}>
          <Layout
            style={{
              backgroundColor: '#F1F1F1',
              width: '95%',
              height: '100%',
              borderRadius: 4,
              padding: 8,
              flexDirection: 'row',
            }}>
            <Layout
              style={{width: '23%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
              <AnimatedCircularProgress
                fill={(correct / limit) * 100}
                size={75}
                width={8}
                duration={2000}
                padding={0}
                lineCap="round"
                tintColor="#F9B208"
                tintColorSecondary="#6FCF79"
                backgroundColor="#FAFAFA">
                {fill => <Text category="h6" status="info">{`${Math.round(fill)}%`}</Text>}
              </AnimatedCircularProgress>
            </Layout>
            <Layout
              style={{
                width: '75%',
                height: '100%',
                backgroundColor: 'transparent',
                justifyContent: 'center',
                // alignItems: 'center',
              }}>
              <Text style={{width: '100%', paddingLeft: '3%'}} category="s1" status="info">
                {formatDate(date)}
              </Text>
              <Layout
                style={{
                  width: '100%',
                  backgroundColor: '#F1F1F1',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Layout style={{backgroundColor: '#F1F1F1', flexDirection: 'row'}}>
                  <CloseIcon style={{width: 25, height: 25, marginRight: 4}} fill="#E40017" />
                  <Text category="h6" status="primary">
                    {wrong}
                  </Text>
                </Layout>
                <Layout style={{backgroundColor: '#F1F1F1', flexDirection: 'row'}}>
                  <CheckIcon style={{width: 25, height: 25, marginRight: 4}} fill="#6FCF79" />
                  <Text category="h6" status="success">
                    {correct}
                  </Text>
                </Layout>
                <Layout style={{backgroundColor: '#F1F1F1', flexDirection: 'row'}}>
                  <HashIcon style={{width: 22, height: 22, marginRight: 4}} fill="#051338" />
                  <Text category="h6" status="info">
                    {limit}
                  </Text>
                </Layout>
                <Layout style={{backgroundColor: '#F1F1F1', flexDirection: 'row'}}>
                  <ClockIcon style={{width: 22, height: 22, marginRight: 4}} fill="#051338" />
                  <Text category="h6" status="info">{`${time}s`}</Text>
                </Layout>
              </Layout>
            </Layout>
            <Button
              // size="small"
              style={{paddingHorizontal: 0, paddingVertical: 0, position: 'absolute', top: 0, right: 0}}
              appearance="ghost"
              accessoryRight={TrashIcon}
              onPress={remove}
            />
          </Layout>
        </TouchableOpacity>
      </MotiView>
    </AnimatePresence>
  );
};
