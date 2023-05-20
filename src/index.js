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

function calcScore({
  XianCao = 0,
  LiangCao = 0,
  GanCao = 0,
  KuCao = 0,
  DuCao = 0
}){
  const sum = XianCao + LiangCao + GanCao + KuCao + DuCao;
  // 加权平均，仙草
  const average = ((XianCao * 10 + LiangCao * 7 + GanCao * 5 + KuCao * 3 + DuCao * 0) / (sum || 1)).toFixed(1);
  return {
    sum,
    score:average
  };
}

createApp({
  data(){
    return {
      db: [],
      searchWords:"",
      pingfenDb:[],
      sortBy:{
        keyName:"id",
        key: i=>i.id,
        desc:false,
      },
    }
  },
  computed:{
    filtedList(){
      let list = [];
      if(this.searchWords.length > 0){
        list= this.db.filter(item=>~item.title.indexOf(this.searchWords));
      }else{
        list= this.db;
      }
      return list.sort((a,b)=>{
        if(!this.sortBy.desc){
          return this.sortBy.key(a) > this.sortBy.key(b) ? 1 : -1
        }else{
          return this.sortBy.key(b) > this.sortBy.key(a) ? 1 : -1
        }
      })
    },
    rateMap(){
      const map = {};
      for(let item of this.pingfenDb){
        map[item.id] = {
          ...item,
          ...calcScore(item)
        };
      }
      return map
    }
  },
  async mounted(){
    const pingfenRes = await fetch('/pingfen.json');
    this.pingfenDb = await pingfenRes.json();
    const dbRes = await fetch('/zxcs.json');
    const db = await dbRes.json();
    db.forEach(item=>{
      if(this.rateMap[item.id]){
        item.rate = this.rateMap[item.id];
      }else{
        item.rate = {
            XianCao : 0,
            LiangCao : 0,
            GanCao : 0,
            KuCao : 0,
            DuCao : 0,
            sum: 0,
            score :'--',
        };
      }
    });
    this.db = db;
  },
  methods:{
    setSort(keyName, key, defaultDesc = false){
      this.sortBy.key = key
      if(this.sortBy.keyName === keyName){
        this.sortBy.desc = !this.sortBy.desc
      }else{
        this.sortBy.desc = defaultDesc;
        this.sortBy.keyName = keyName;
      }
    },
    errorHandler(e){
      console.log(e)
    }
  },
}).mount("#app")