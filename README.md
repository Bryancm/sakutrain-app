# Sakutrain

  Sakutrain helps you to test your sakuga knowledge with videos from sakugabooru and discover new talents. You can configure a game round as you like. Some of the things you can configure are: tags to filter videos, set a video limit, set a time limit, and also you can view your score history plus share it to compare it with friends!
 


## Screenshots

<div style="display:flex;flex-direction:row;" >
  <img src="https://raw.githubusercontent.com/Bryancm/sakutrain-app/main/assets/0.png" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/sakutrain-app/main/assets/1.png" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/sakutrain-app/main/assets/2.png" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/sakutrain-app/main/assets/3.png" width="260" height="589" /> 
</div>


  
## Tech Stack

- [React Native](https://reactnative.dev)
- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)
- [Moti](https://moti.fyi/installation)
- [React Native Video](https://github.com/react-native-video/react-native-video)
- [React Native Video Cache](https://github.com/zhigang1992/react-native-video-cache)
- [React Native Video Controls](https://github.com/itsnubix/react-native-video-controls)
- [React Navigation](https://reactnavigation.org)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)

More details on dependencies can be found on package.json file.
  
## Folder Structure

    ├── __tests__               # Test folder (TO DO)
    ├── android                 # Native android project (you can use android studio to open it)
    ├── api                     # Sakugabooru API Calls
    ├── assets                  # Fonts and images
    ├── components              # UI Components (All are functional components)
    ├── ios                     # Native iOS project (you can use xcode to open the workspace)
    ├── navigation              # App Navigator (React navigation)
    ├── screens                 # Main screens that the app navigator uses (also are functional components)
    ├── styles                  # Some custom styles for components
    ├── util                    # Some util like cache,date and storage functions
    ├── App.js                  # Main App file
    ├── app.json                # App config like name, version, splashscreen and admob id
    ├── custom-theme-3.json     # UI Kitten file for color theme
    ├── mapping.json            # UI Kiitten mapping file for custom fonts
    ├── package.json            # Dependencies, scripts and project details
    └── README.md

    
## Installation

- Dependencies
```bash  //iOS
  yarn // install dependencies  
```

Sakutrain uses [Moti](https://moti.fyi) for animations, please follow their [official installation instruccions](https://moti.fyi/installation)
- iOS
```bash  //iOS
// After dependencies installation
  cd ios
  pod install
  cd ..
  yarn ios // run on ios
```

- Android
```
// After dependencies installation
 yarn android // run on android
```

## Roadmap

- Be able to open a post in [Sakuga Mobile](https://github.com/Bryancm/sakuga_mobile)

    
## Support

For support, email me bryan.mtzs@gmail.com or send me a message on twitter [@bryanmtzw](https://twitter.com/bryanmtzw)

  
## Contributing

Contributions are always welcome!

You can contribute using the GitHub Flow (create a branch, commit changes, and open a pull request)
  
