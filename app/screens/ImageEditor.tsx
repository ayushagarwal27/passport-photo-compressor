import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BackgroundImageEditor from '../components/BackgroundImageEditor';
import ConfirmModal from '../components/ConfirmModal';
import EditorTools from '../components/EditorTools';
import ImageEditorHeader from '../components/ImageEditorHeader';
import SelectedImage from '../components/SelectedImage';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  selectAndCropImageFromCamera,
  selectAndCropImageFromDevice,
} from '../utils/imageSelector';

type RouteProps = StackScreenProps<RootStackParamList, 'ImageEditor'>;
interface Props {
  route: RouteProps['route'];
}

const ImageEditor: FC<Props> = ({route}): JSX.Element => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const backActionRef = useRef<any>();
  const {imageUri} = route.params;

  const displayConfirmModal = (): void => setShowConfirmModal(true);
  const hideConfirmModal = (): void => setShowConfirmModal(false);

  const selectImageToCompress = async (): Promise<void> => {
    const {path, error} = await selectAndCropImageFromDevice();
    if (error) {
      return console.log(error);
    }
    setSelectedImage(path);
  };

  const captureImageToCompress = async (): Promise<void> => {
    const {path, error} = await selectAndCropImageFromCamera();
    if (error) {
      return console.log(error);
    }
    setSelectedImage(path);
  };

  // Handling back press manually
  const handleMoveToBackScreen = (): void => {
    navigation.removeListener('beforeRemove', () => {});
    hideConfirmModal();
    navigation.dispatch(backActionRef.current);
  };

  // Handling the back press
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      displayConfirmModal();
      backActionRef.current = e.data.action;
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageEditorHeader />
      <BackgroundImageEditor />

      <View style={styles.imageContainer}>
        <SelectedImage uri={selectedImage || imageUri} />
      </View>

      <EditorTools
        onSelectAnother={selectImageToCompress}
        onCaptureAnother={captureImageToCompress}
      />

      <ConfirmModal
        title="Are you sure ?"
        visible={showConfirmModal}
        message="Are you sure because this action will discard all your changes ?"
        onCancelPress={hideConfirmModal}
        onDiscardPress={handleMoveToBackScreen}
      />
    </View>
  );
};

export default ImageEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
