import React from 'react';
import {SafeAreaView, Linking, Dimensions, ScrollView, Platform} from 'react-native';
import {View as MotiView} from 'moti';
import {Layout, TopNavigation, TopNavigationAction, Icon, Text, Button} from '@ui-kitten/components';
import {styles} from '../styles';
import LottieView from 'lottie-react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const BackIcon = props => <Icon {...props} name="arrow-back-outline" />;
const TwitterIcon = props => <Icon {...props} name="twitter" />;
const ExternalLink = props => <Icon {...props} name="play-circle" />;
const Person = props => <Icon {...props} name="person" />;
const Star = props => <Icon {...props} name="star" />;

export const AboutScreen = ({navigation}) => {
  const openURL = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  const navigateBack = () => {
    navigation.goBack();
  };

  const accessoryLeft = () => (
    <>
      <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    </>
  );

  return (
    <Layout style={{flex: 1}}>
      <Layout style={styles.animationBackground}>
        <LottieView
          style={{
            height: screenHeight,
            width: screenWidth,
          }}
          source={require('../assets/25114-background-slide.json')}
          autoPlay
          loop={true}
        />
      </Layout>
      <SafeAreaView style={{flex: 1}}>
        <MotiView
          from={{opacity: 0, translateY: -100}}
          animate={{opacity: 1, translateY: 0}}
          transition={{type: 'timing', delay: 0}}>
          <TopNavigation
            style={{backgroundColor: 'transparent'}}
            title="About"
            alignment="center"
            accessoryLeft={accessoryLeft}
          />
        </MotiView>
        <ScrollView contentContainerStyle={{flex: 1, ...styles.center, backgroundColor: 'transparent'}}>
          <MotiView
            style={{...styles.center}}
            from={{opacity: 0, translateY: screenHeight}}
            animate={{opacity: 1, translateY: 0}}
            transition={{type: 'timing', delay: 100}}>
            <Text category="c1">Idea</Text>
            <Button
              style={{marginBottom: 20}}
              appearance="ghost"
              accessoryRight={TwitterIcon}
              onPress={() => openURL('https://twitter.com/ftLoic')}>
              <Text category="s1" style={{fontWeight: '900'}}>
                Loïc
              </Text>
            </Button>

            <Text category="c1">Developed</Text>
            <Layout style={{...styles.center, flexDirection: 'row', marginBottom: 20, backgroundColor: 'transparent'}}>
              <Button
                appearance="ghost"
                accessoryRight={TwitterIcon}
                onPress={() => openURL('https://twitter.com/ftLoic')}>
                <Text category="s1" style={{fontWeight: '900'}}>
                  Loïc
                </Text>
              </Button>

              <Button
                appearance="ghost"
                accessoryRight={TwitterIcon}
                onPress={() => openURL('https://twitter.com/bryanmtzw')}>
                <Text category="s1" style={{fontWeight: '900'}}>
                  Bryan
                </Text>
              </Button>
            </Layout>

            <Text category="c1">Home background animation</Text>
            <Button
              style={{marginBottom: 20}}
              appearance="ghost"
              accessoryRight={Person}
              onPress={() => openURL('https://lottiefiles.com/user/102655')}>
              <Text category="s1" style={{fontWeight: '900'}}>
                Tom Hyde
              </Text>
            </Button>

            <Text category="c1">Time's up animation</Text>
            <Button
              style={{marginBottom: 20}}
              appearance="ghost"
              accessoryRight={Person}
              onPress={() => openURL('https://lottiefiles.com/vik4graphic')}>
              <Text category="s1" style={{fontWeight: '900'}}>
                vik4graphic
              </Text>
            </Button>

            <Text category="c1">Checkmark Animation</Text>
            <Button
              style={{marginBottom: 20}}
              appearance="ghost"
              accessoryRight={Person}
              onPress={() => openURL('https://lottiefiles.com/user/82925')}>
              <Text category="s1" style={{fontWeight: '900'}}>
                David O. Andersen
              </Text>
            </Button>

            <Text category="c1">All the medias are drawn from</Text>
            <Button
              style={{marginBottom: 20}}
              appearance="ghost"
              accessoryRight={ExternalLink}
              onPress={() => openURL('https://www.sakugabooru.com')}>
              <Text category="s1" style={{fontWeight: '900'}}>
                Sakugabooru
              </Text>
            </Button>
            <Button
              appearance="ghost"
              accessoryRight={Star}
              onPress={() =>
                openURL(
                  Platform.OS === 'ios'
                    ? 'https://apps.apple.com/us/app/sakutrain/id1576075738'
                    : 'https://play.google.com/store/apps/details?id=com.sakutrain',
                )
              }>
              <Text category="s1" style={{fontWeight: '900'}}>
                Rate
              </Text>
            </Button>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};
