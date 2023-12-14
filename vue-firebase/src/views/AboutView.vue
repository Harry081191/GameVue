<template>
  <div>
    <input type="file" @change="uploadImage" />
    <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" />
  </div>
</template>
<script>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  data() {
    return {
      imageUrl: null,
    };
  },
  methods: {
    async uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const storage = getStorage();
          const imageRef = storageRef(storage, `images/${file.name}`);
          await uploadBytes(imageRef, file);
          const downloadURL = await getDownloadURL(imageRef);
          this.imageUrl = downloadURL;
          console.log(this.imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
  },
};
</script>
