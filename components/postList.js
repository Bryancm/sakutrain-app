import React from 'react';
import {FlatList} from 'react-native';

import {PostItem} from '../components/postItem';

export const PostList = ({posts, setToast}) => {
  const renderItem = ({item, index}) => <PostItem item={item} index={index} setToast={setToast} />;
  const keyExtractor = item => item.id.toString();
  return <FlatList data={posts} renderItem={renderItem} keyExtractor={keyExtractor} />;
};
