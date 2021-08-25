import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, ActivityIndicator, Alert, ScrollView, TouchableOpacity} from 'react-native';
import {View as MotiView, AnimatePresence} from 'moti';
import {Layout, TopNavigation, TopNavigationAction, Icon, Text, Input, Button, Toggle} from '@ui-kitten/components';
import {ScoreList} from '../components/scoreList';
import {styles} from '../styles';
import {getData, storeData, removeData} from '../util/storage';
import {defaultSeries} from '../util/defaultSeries';
import {formatPostForGame} from '../api/post';
import {findTag} from '../api/tag';

const BackIcon = props => <Icon {...props} name="arrow-back-outline" />;
const ArrowLeftIcon = props => <Icon style={{width: 20, height: 20}} fill="#FAFAFA" name="arrow-left" />;
const ArrowRightIcon = props => <Icon style={{width: 20, height: 20}} fill="#FAFAFA" name="arrow-right" />;
const AddIcon = props => <Icon style={{width: 20, height: 20}} fill="#FAFAFA" name="plus" />;
const CloseIcon = props => <Icon {...props} name="close" />;
const TrashIcon = props => <Icon {...props} name="trash-2-outline" />;
const RestartIcon = props => <Icon {...props} name="refresh-outline" />;

export const SettingsScreen = ({navigation, route}) => {
  const scrollView = useRef();
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [videoLimit, setVideoLimit] = useState(route.params.videoLimit);
  const [timeLimit, setTimeLimit] = useState(route.params.timeLimit);
  const [useTags, setUseTags] = useState(route.params.useTags);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');

  const addTag = async () => {
    try {
      if (!text || !text.trim()) return setToast('Pleae type a tag');
      setLoading(true);
      const inputTags = text.toLowerCase().split(' ');
      for (const tag of inputTags) {
        const results = await findTag({name: tag});
        const t = results.filter(r => r.name === tag)[0];
        if (t.type !== 3) throw new Error('copyright type error');
        const posts = await formatPostForGame({tags: tag.trim()});
        if (!posts || posts.length === 0) {
          setLoading(false);
          return setToast(`The tag "${tag}" doesn't have posts to use, please try with another tag`);
        }
      }
      const newTags = [...new Set([...inputTags, ...tags])];
      setTags(newTags);
      setText('');
      scrollView.current.scrollTo({animated: true, y: 0});
      setLoading(false);
      setToast('Tag added');
    } catch (error) {
      console.log('ADD_TAG_ERROR: ', error);
      setLoading(false);
      setToast('Error, please try with another tag :(');
    }
  };

  const deleteTag = name => {
    const newTags = tags.filter(t => t !== name);
    setTags(newTags);
    setToast('Tag removed');
  };

  const deleteTagAlert = async name => {
    if (tags && tags.length > 0) {
      Alert.alert('Remove', `Remove "${name}" from your tag list ?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => deleteTag(name), style: 'destructive'},
      ]);
    } else {
      setToast(`The tag list is alerady empty`);
    }
  };

  const removeAll = () => {
    setTags([]);
  };

  const clearAlert = async () => {
    if (tags && tags.length > 0) {
      Alert.alert('Remove all', `Do you want to clear your tag list ?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Confirm', onPress: removeAll, style: 'destructive'},
      ]);
    } else {
      setToast(`The tag list is alerady empty`);
    }
  };

  const restoreSettings = () => {
    setLoadingRestore(true);
    setTimeout(() => {
      setVideoLimit(20);
      setTimeLimit(0);
      setUseTags(true);
      setTags(defaultSeries);
      setLoadingRestore(false);
      setToast('Settings restored');
    }, 250);
  };

  const restoreAlert = async () => {
    Alert.alert('Restore Default', `Do you want to restore the default settings ?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Confirm', onPress: restoreSettings, style: 'destructive'},
    ]);
  };

  const saveData = async settings => {
    await storeData('settings', settings);
  };

  useEffect(() => {
    if (toast) setTimeout(() => setToast(''), 2500);
  }, [toast]);

  useEffect(() => {
    saveData({videoLimit, timeLimit, useTags, tags});
  }, [videoLimit, timeLimit, useTags, tags]);

  useEffect(() => {
    setTimeout(() => {
      setTags(route.params.tags);
      setLoading(false);
    }, 500);
  }, []);

  const decreaseVideoLimit = () => {
    if (videoLimit <= 10) return setVideoLimit(5);
    setVideoLimit(videoLimit - 10);
  };

  const increaseVideoLimit = () => {
    if (videoLimit === 5) return setVideoLimit(10);
    if (videoLimit >= 50) return setVideoLimit(50);
    setVideoLimit(videoLimit + 10);
  };

  const decreaseTimeLimit = () => {
    if (timeLimit <= 0) return setTimeLimit(0);
    setTimeLimit(timeLimit - 30);
  };

  const increaseTimeLimit = () => {
    if (timeLimit >= 530) return setTimeLimit(600);
    setTimeLimit(timeLimit + 30);
  };

  const toggleUseTags = () => setUseTags(!useTags);

  const navigateBack = () => {
    navigation.goBack();
  };

  const accessoryRight = () => (
    <>
      {loadingRestore ? (
        <ActivityIndicator color="#FAFAFA" />
      ) : (
        <TopNavigationAction icon={RestartIcon} onPress={restoreAlert} />
      )}
    </>
  );

  const accessoryLeft = () => (
    <>
      <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    </>
  );

  const onFocus = () => {
    scrollView.current.scrollTo({animated: true, y: 260});
  };

  const mapTags = name => {
    const remove = () => deleteTagAlert(name);
    return (
      <Layout key={name} style={styles.tag}>
        <Text category="c2">{name}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={remove}>
          <CloseIcon style={{width: 18, height: 18, marginLeft: 12}} fill="#E40017" />
        </TouchableOpacity>
      </Layout>
    );
  };

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
                <Text category="c2">{toast}</Text>
              </Layout>
            </MotiView>
          )}
        </AnimatePresence>
        <MotiView
          from={{opacity: 0, translateY: -100}}
          animate={{opacity: 1, translateY: 0}}
          transition={{type: 'timing', delay: 0}}>
          <TopNavigation
            title="Settings"
            alignment="center"
            accessoryLeft={accessoryLeft}
            accessoryRight={accessoryRight}
          />
        </MotiView>
        <ScrollView ref={scrollView} style={{flex: 1}}>
          <Layout style={styles.settingsOption}>
            <Text category="h6" status="info">
              Video Limit
            </Text>
            <Layout style={{flexDirection: 'row', backgroundColor: '#FAFAFA'}}>
              <Button size="tiny" status="info" accessoryLeft={ArrowLeftIcon} onPress={decreaseVideoLimit} />
              <Input
                disabled
                style={{backgroundColor: '#DFDFDF', borderWidth: 0, width: 60, marginHorizontal: 8}}
                textStyle={{color: '#051338', fontWeight: '900', textAlign: 'center'}}
                value={`${videoLimit}`}
              />
              <Button size="tiny" status="info" accessoryLeft={ArrowRightIcon} onPress={increaseVideoLimit} />
            </Layout>
          </Layout>
          <Layout style={styles.settingsOption}>
            <Text category="h6" status="info">
              Time Limit
            </Text>
            <Layout style={{flexDirection: 'row', backgroundColor: '#FAFAFA'}}>
              <Button size="tiny" status="info" accessoryLeft={ArrowLeftIcon} onPress={decreaseTimeLimit} />
              <Input
                disabled
                style={{
                  backgroundColor: '#DFDFDF',
                  borderWidth: 0,
                  width: timeLimit > 0 ? 80 : 100,
                  marginHorizontal: 8,
                }}
                textStyle={{color: '#051338', fontWeight: '900', textAlign: 'center'}}
                value={timeLimit > 0 ? `${timeLimit}s` : 'No limit'}
              />
              <Button size="tiny" status="info" accessoryLeft={ArrowRightIcon} onPress={increaseTimeLimit} />
            </Layout>
          </Layout>
          <Layout style={styles.settingsOption}>
            <Layout style={{backgroundColor: '#FAFAFA', width: '80%'}}>
              <Text category="h6" status="info">
                Use tags
              </Text>
              <Text status="info" category="c1">
                Turn it on to use posts with the tags specified below. Disable it to use any post.
              </Text>
            </Layout>

            <Layout style={{flexDirection: 'row', backgroundColor: '#FAFAFA'}}>
              <Toggle checked={useTags} status={useTags ? 'success' : 'info'} onChange={toggleUseTags} />
            </Layout>
          </Layout>
          <Layout
            style={{
              backgroundColor: '#FAFAFA',
              borderRadius: 4,
              padding: 16,
              margin: 8,
            }}>
            <Text category="h6" status="info">
              Tags
            </Text>
            <Button
              size="small"
              style={{position: 'absolute', right: 0}}
              appearance="ghost"
              accessoryRight={TrashIcon}
              onPress={clearAlert}
            />

            <Layout style={{flexDirection: 'row', width: '100%', backgroundColor: '#FAFAFA', marginVertical: 8}}>
              <Input
                style={{backgroundColor: '#DFDFDF', borderWidth: 0, width: '82%', marginRight: '3%'}}
                textStyle={{color: '#051338'}}
                autoCapitalize="none"
                value={text}
                onChangeText={text => setText(text)}
                onFocus={onFocus}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              {loading ? (
                <ActivityIndicator color="#051338" />
              ) : (
                <Button style={{width: '15%'}} size="small" status="info" accessoryLeft={AddIcon} onPress={addTag} />
              )}
            </Layout>
            <Layout style={{backgroundColor: '#FAFAFA', flexDirection: 'row', flexWrap: 'wrap'}}>
              {tags.map(mapTags)}
            </Layout>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
