import React from 'react';
import {FlatList, Dimensions} from 'react-native';
import {ScoreItem} from './scoreItem';
import {Layout, Text, Icon} from '@ui-kitten/components';

const screenHeight = Dimensions.get('window').height;
const EyeIcon = props => <Icon name="clock-outline" style={{width: 50, height: 50}} fill="#FAFAFA" />;

export const ScoreList = ({scores, alertRemove}) => {
  const renderItem = ({item, index}) => <ScoreItem item={item} index={index} alertRemove={alertRemove} />;
  const keyExtractor = item => item.id.toString();
  return (
    <FlatList
      data={scores}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        <Layout style={{height: screenHeight * 0.6, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <EyeIcon />
          <Text category="h6">No scores yet</Text>
        </Layout>
      }
    />
  );
};
