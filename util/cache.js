import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const removeDir = async dir => {
  const exist = await RNFS.exists(dir);
  if (exist) await RNFS.unlink(dir);
};

export const removeFiles = async directory => {
  const cache_file_limit = 2;
  const exist = await RNFS.exists(directory);
  if (exist) {
    const dir = await RNFS.readDir(directory);
    if (dir.length > cache_file_limit) {
      dir.sort((a, b) => new Date(a.mtime) - new Date(b.mtime));
      const diff = dir.length - cache_file_limit;
      const files_to_delete = dir.slice(0, diff);
      for (const file of files_to_delete) {
        await RNFS.unlink(file.path);
      }
    }
  }
};

export const cleanCache = async () => {
  try {
    if (Platform.OS === 'android') {
      const dir = `/storage/emulated/0/Android/data/com.sakutrain/cache/video-cache`;
      removeFiles(dir);
    } else {
      const video_dir = `${RNFS.DocumentDirectoryPath}/KTVHTTPCache`;
      const sdimage_dir = `${RNFS.CachesDirectoryPath}/com.hackemist.SDImageCache/default`;
      const frames_dir = `${RNFS.CachesDirectoryPath}/framesCache`;
      const gif_dir = `${RNFS.CachesDirectoryPath}/gifCache`;
      removeFiles(video_dir);
      removeFiles(sdimage_dir);
      removeDir(frames_dir);
      removeDir(gif_dir);
    }
  } catch (error) {
    console.log('CLEAN_CACHE_ERROR: ', error);
  }
};
