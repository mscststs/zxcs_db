import { createApp } from "/lib/vue/vue.esm-browser.js";


function loadFile(fileName, content){
  const aLink = document.createElement('a');
  const blob = new Blob([content], {
      type: 'text/plain'
  });
  // const evt = new Event('click');
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
  URL.revokeObjectURL(blob);
}


createApp({
  data(){
    return {
      db: [],
      searchWords:"",
    }
  },
  computed:{
    filtedList(){
      if(this.searchWords.length > 0){
        return this.db.filter(item=>~item.title.indexOf(this.searchWords));
      }else{
        return this.db;
      }
    }
  },
  async mounted(){
    const res = await fetch('/zxcs.json');
    this.db = await res.json();
  },
  methods:{
  },
}).mount("#app")