import {StackScreenProps} from '@react-navigation/stack';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import ImageEditorHeader from '../components/ImageEditorHeader';
import {RootStackParamList} from '../navigation/AppNavigator';

type RouteProps = StackScreenProps<RootStackParamList, 'ImageEditor'>;
interface Props {
  route: RouteProps['route'];
}

const ImageEditor: FC<Props> = ({route}): JSX.Element => {
  const {imageUri} = route.params;

  return (
    <View style={styles.container}>
      <ImageEditorHeader />
    </View>
  );
};

export default ImageEditor;

const styles = StyleSheet.create({
  container: {},
});
