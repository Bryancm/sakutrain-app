import 'react-native-reanimated';
import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {default as theme} from './custom-theme-3.json';
import {default as mapping} from './mapping.json';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {AppNavigator} from './navigator';

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{...eva.dark, ...theme}} customMapping={mapping}>
      <AppNavigator />
    </ApplicationProvider>
  </>
);
