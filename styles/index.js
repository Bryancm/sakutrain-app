import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  shadowRounded: {
    borderRadius: 4,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // backgroundColor: '#F5F5F5',
    padding: 6,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  animationBackground: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreIcons: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    padding: 16,
    margin: 8,
  },
  tag: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
