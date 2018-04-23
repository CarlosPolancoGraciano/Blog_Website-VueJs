<template>
  <span>
    <i :class="'fa fa-' + iconName" ></i>
  </span>
</template>
<script>
export default {
  name: 'AppIcon',
  props: {
    iconName: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>

</style>
