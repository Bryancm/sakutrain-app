import React, {useState} from 'react';
import {Dimensions, Linking} from 'react-native';
import {Layout, Text, Icon, Button, OverflowMenu, MenuItem} from '@ui-kitten/components';
import {View as MotiView} from 'moti';
import {styles} from '../styles';
import FastImage from 'react-native-fast-image';
import Clipboard from '@react-native-community/clipboard';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CloseIcon = props => <Icon {...props} name="close" />;
const CheckIcon = props => <Icon {...props} name="checkmark" />;
const ExternalLink = props => <Icon {...props} name="external-link-outline" />;
const LinkIcon = props => <Icon {...props} name="link-2-outline" />;
const TagIcon = props => <Icon {...props} name="pricetags-outline" />;
const MoreIcon = props => <Icon {...props} name="more-vertical" />;

export const PostItem = ({item, index, setToast}) => {
  const url = `https://www.sakugabooru.com/post/show/${item.id}`;
  const [visible, setVisible] = useState(false);
  const toggleMenu = () => setVisible(!visible);
  const anchor = () => <Button status="info" appearance="ghost" accessoryLeft={MoreIcon} onPress={toggleMenu} />;

  const openURL = () => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const copyURL = () => {
    toggleMenu();
    Clipboard.setString(url);
    setToast('Url copied');
  };

  const copyArtist = () => {
    toggleMenu();
    const tag = item.tags.filter(t => t.type === 'artist')[0];
    Clipboard.setString(tag ? tag.name : '');
    setToast('Artist tag copied');
  };

  const copyCopyright = () => {
    toggleMenu();
    const tag = item.tags.filter(t => t.type === 'copyright')[0];
    Clipboard.setString(tag ? tag.name : '');
    setToast('Copyright tag copied');
  };

  const correct = item.selected === item.artists[0];

  return (
    <MotiView
      from={{opacity: 0, translateY: screenHeight}}
      animate={{opacity: 1, translateY: 0}}
      transition={{
        type: 'timing',
        delay: index * 100,
        translateY: {
          type: 'spring',
          damping: 29,
          stiffness: 300,
        },
      }}>
      <Layout style={{alignItems: 'center', width: '100%', height: 60, marginVertical: 8}}>
        <Layout
          style={{
            backgroundColor: '#FAFAFA',
            width: '95%',
            height: '100%',
            borderRadius: 4,
            padding: 4,
            flexDirection: 'row',
          }}>
          <FastImage
            source={{uri: item.preview_url}}
            style={{height: '100%', width: '25%', borderRadius: 4}}
            resizeMode="cover"
          />
          <Layout style={{backgroundColor: '#FAFAFA', width: '65%', padding: 4}}>
            <Layout style={{backgroundColor: '#FAFAFA', flexDirection: 'row', alignItems: 'center'}}>
              <Text category="c1" status="info">
                {`${item.selected}`}
              </Text>
              {correct ? (
                <CheckIcon style={{width: 20, height: 20, marginLeft: 4}} fill="#4CAD5F" />
              ) : (
                <CloseIcon style={{width: 20, height: 20, marginLeft: 4}} fill="#E40017" />
              )}
            </Layout>
            <Layout style={{backgroundColor: '#FAFAFA', flexDirection: 'row', alignItems: 'center'}}>
              <Text category="s1" status="info">
                {item.artists[0]}
              </Text>
              <CheckIcon style={{width: 20, height: 20, marginLeft: 4}} fill="#4CAD5F" />
            </Layout>
          </Layout>
          <Layout style={{width: '10%', backgroundColor: '#FAFAFA', ...styles.center}}>
            <OverflowMenu placement="left" anchor={anchor} visible={visible} onBackdropPress={toggleMenu}>
              <MenuItem
                style={{backgroundColor: '#FAFAFA'}}
                key="1"
                accessoryRight={ExternalLink}
                title={
                  <Text category="c1" status="info">
                    Open post url
                  </Text>
                }
                onPress={openURL}
              />
              <MenuItem
                style={{backgroundColor: '#FAFAFA'}}
                key="2"
                accessoryRight={LinkIcon}
                title={
                  <Text category="c1" status="info">
                    Copy post url
                  </Text>
                }
                onPress={copyURL}
              />
              <MenuItem
                style={{backgroundColor: '#FAFAFA'}}
                key="3"
                accessoryRight={TagIcon}
                title={
                  <Text category="c1" status="info">
                    Copy artist tag
                  </Text>
                }
                onPress={copyArtist}
              />
              <MenuItem
                style={{backgroundColor: '#FAFAFA'}}
                key="3"
                accessoryRight={TagIcon}
                title={
                  <Text category="c1" status="info">
                    Copy copyright tag
                  </Text>
                }
                onPress={copyCopyright}
              />
            </OverflowMenu>
          </Layout>
        </Layout>
      </Layout>
    </MotiView>
  );
};
