<template>
  <!--HTML相關 
      cd home 
      npm run serve-->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
    <homescss msg="Welcome to Your Vue.js App" />
    <homejs msg="Welcome to Your Vue.js App" />
  </div>
  <section class="container">
    <button type="button"><i class="fas fa-plus"></i></button>
    <button type="button"><i class="fas fa-minus"></i></button>
    <table class="container" id="dynamicTable"> </table>
  </section>
  <footer class="container">
    <div class="bg-dark p-3 my-3 text-white text-center">
      <div class="row">
        <p>&copy; SH_SH 2023</p>
      </div>
    </div>
  </footer>
</template>
<script>
import { getDatabase, ref as firebaseRef, onValue } from 'firebase/database';
import { firebaseApp } from '@/main';
export default {
  name: 'HomeView',
  components: {
    homescss, homejs
  },
  data() {
    return {
      data: {},
    }
  },
  mounted() {
    const dynamicTable = document.getElementById('dynamicTable');
    const db = getDatabase(firebaseApp);
    dynamicTable.innerHTML = ""; // 清空现有表格内容
    var ccount = 0;
    var keY = 1;
    //var Plus=document.getElementsByClassName("fas fa-plus");
    var dataname = ['板手/', '螺絲刀/', '鉗子/'];
    var headers = ['No.', '工具名稱', '未使用數量', '總數量'];
    if (keY == 1) headers.splice(4, 0, '借用工具數量');

    var newRow = dynamicTable.insertRow(); // 插入新的表格行
    for (var i = 0; i < headers.length; i++) {
      var cell = newRow.insertCell(i); // 插入新的單元格，位于指定列
      cell.textContent = headers[i];
    }

    /*var btn = document.createElement("BUTTON");
    btn.innerHTML = "add";
    document.body.appendChild(btn);*/
    for (var j = 0; j < dataname.length; j++) {
      const dataRef = firebaseRef(db, dataname[j]);
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        //var button = document.createElement('input');
        for (var k = 0; k < Object.keys(data).length; k++) {
          ccount += 1;
          var a = 50;
          const newButton = document.createElement('button');
          newButton.textContent = 'Click me!';
          var datadetail = [ccount, Object.keys(data)[k], a - Object.values(data)[k], a];
          if (keY == 1) var kkeY = 5;//datadetail.splice(4, 0, "");//newButton
          var newRow = dynamicTable.insertRow(); // 插入新的表格行
          for (var l = 0; l < kkeY/*datadetail.length*/; l++) {// 插入新的單元格，位于指定列
            var cell = newRow.insertCell(l); 
            cell.textContent = datadetail[l];
            if(l ==4){
              document.body.appendChild(newButton);
            }
            
          }
          if (keY == 1) datadetail.splice(4, 1);
        }
      });
    }
  },
}
</script>