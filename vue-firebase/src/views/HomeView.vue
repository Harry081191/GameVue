<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
  <div class="Longing">
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
      <div v-if="Serchstatus === false" class="button-container">
        <router-link :to="{ name: 'LoginView' }" class="custom-link evenly-spaced-text" @click="Logout">登出</router-link>
      </div>
      <div class="container-fluid">
        <div>
          <router-link to="/HomeView" style="color: #ffffff;">MageSurvivor</router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto"> <!-- 使用 ml-auto 使選項靠右對齊 -->
            <li class="nav-item">
              <router-link to="/HomeView" class="nav-link" style="color: #ffffff;">首頁</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Officialnotificationarea" class="nav-link" style="color: #ffffff;">官方公告</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Playertalkarea" class="nav-link" style="color: #ffffff;">討論區</router-link>
            </li>
            <li class="nav-item">
              <a href="https://drive.google.com/file/d/1d7i2-ogLFM8aEOmYDkwpWE-QSg32K3gP/view?usp=sharing" target="_blank"
                class="nav-link" style="color: #ffffff;">下載遊戲</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false" style="color: #ffffff;">
                會員選單
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link to="/ChangePassword" class="nav-link" style="color: #ffffff;">更改密碼</router-link>
                <router-link to="/EmailVerification" class="nav-link" style="color: #ffffff;">綁定電子郵件</router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <div class="p-3 wrapper">
        <div class="row justify-content-center">
          <div class="col-6" style="text-align: center">
            <h2>角色資訊<a v-if="data.Manager">(管理者)</a></h2>
          </div>
          <button type="button" v-if="myselfidentity && Serchstatus && !data.Manager && data.UserAvailable" @click="ban">
            <i class="fas fa-user-alt-slash"></i>
          </button>
          <button type="button" v-if="myselfidentity && Serchstatus && !data.Manager && !data.UserAvailable"
            @click="unban">
            <i class="fas fa-user-alt"></i>
          </button>
          <div class="col-10 bg-secondary text-white"
            style=" border-top-left-radius: 50px; border-top-right-radius: 50px; text-align: center;">
            <div class="dropdown" style="text-align: right; margin-right: 15px; margin-top: 5px;">
              <select v-model="selectedOption">
                <option value="">請選擇</option>
                <option v-for="option in options" :value="option" :key="option.key">
                  {{ option.value }}
                </option>
              </select>
            </div>
            <p style="font-size: 20px">名稱：{{ data.name }}</p>
            <img class="resizable-image" :src="data.UserImage" />
          </div>
          <div v-if="Recorddata === null" class="col-10 bg-secondary text-white"
            style=" border-bottom-left-radius: 50px; border-bottom-right-radius: 50px; text-align: center;">
            <a style="font-size: 20px">此帳戶目前沒有任何紀錄</a>
          </div>
          <div v-if="Recorddata !== null" class="col-10 bg-secondary" style="text-align: center">
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="color:white; margin-bottom: 15px">最近遊玩</p>
                <li style="margin-bottom: 20px" v-for="(item, key, index) in Recorddata" :key="key">
                  <template v-if="key !== 'TotalRecord' && index >= RecordLength - 6">
                    <button style="background-color:transparent; border:0" type="button" @click="toggleDetail(key)">
                      <a style="color:white;">遊玩日期{{ key }}： 等級：{{ item.Level }}／擊殺數：{{ item.killnumber
                      }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}</a>
                    </button>
                    <Transition>
                      <div v-if="showDetail" class="form-container">
                        <ul class="custom-list">
                          <li v-for="(item, key1) in Recorddata" :key="key1">
                            <template v-if="key1 === keycheck">
                              <a style="font-size: 20px;">遊玩日期{{ key1 }}： 等級：{{ item.Level }}／擊殺數：{{ item.killnumber
                              }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}{{ item.SkillUpgradeRecord }}</a>
                            </template>
                          </li>
                        </ul>
                      </div>
                    </Transition>
                  </template>
                </li>
              </ul>
            </a>
          </div>
          <div v-if="Recorddata !== null && (selectedOption.value === '等級最高')" class="col-10 bg-secondary text-white"
            style="text-align: center">
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="color:white; margin-top: 15px; margin-bottom: 15px">最高等級</p>
                <li style="margin-bottom: 20px" v-for="(item, key, index) in Recorddatal" :key="key">
                  <template v-if="key !== 'TotalRecord' && index < 3">
                    <button style="background-color:transparent; border:0" type="button" @click="toggleDetail(key)">
                      <a style="color:white;">遊玩日期{{ key }}： 等級：{{ item.Level }}／擊殺數：{{ item.killnumber
                      }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}</a>
                    </button>
                    <Transition>
                      <div v-if="showDetail" class="form-container">
                        <ul class="custom-list">
                          <li v-for="(item, key1) in Recorddatal" :key="key1">
                            <template v-if="key1 === keycheck">
                              <a style="color:black; font-size: 18px;">遊玩日期{{ key1 }}： 等級：{{ item.Level }}／擊殺數：{{
                                item.killnumber }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}<br />
                                <div class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;">習得技能：</div>
                                  </div>
                                  <div class="column">
                                    <div style="text-align: left;">升級詳細：</div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFireBall" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFireBall">火球：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.FireBallDamage && !item.SkillUpgradeRecord.FireballPierce && !item.SkillUpgradeRecord.FireBallProject && !item.SkillUpgradeRecord.FireBallChain"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FireBallDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FireBallDamage * 20 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireballPierce">穿透敵人：{{
                                          item.SkillUpgradeRecord.FireballPierce * 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallProject">發射數量：{{
                                          item.SkillUpgradeRecord.FireBallProject * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallChain">自動追蹤：{{
                                          item.SkillUpgradeRecord.FireBallChain }}<br /></a></div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningBlast" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningBlast">閃電爆破：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.LightningBlastDamage && !item.SkillUpgradeRecord.LightningBlastHit && !item.SkillUpgradeRecord.LightningBlastHitRange && !item.SkillUpgradeRecord.LightningBlastAttackRange"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningBlastDamage * 15 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHit">擊中數量：{{
                                          item.SkillUpgradeRecord.LightningBlastHit * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHitRange">連鎖距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastHitRange * 0.2 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastAttackRange">鎖敵距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastAttackRange * 0.1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getMagicWeapon" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getMagicWeapon">魔法武器：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.MagicWeaponDamage && !item.SkillUpgradeRecord.MagicWeaponNum"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponDamage * 10 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponNum">數量提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponNum * 2 + 1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFlameJet" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFlameJet">噴射火焰：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.FlameJetDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FlameJetDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FlameJetDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getWaterSplash" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getWaterSplash">水花濺射：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.WaterSplashDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.WaterSplashDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.WaterSplashDamage * 20 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getBloodExplode" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getBloodExplode">血液爆發：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.BloodExplodeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.BloodExplodeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.BloodExplodeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningStrike" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningStrike">閃電打擊：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.LightningStrikeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningStrikeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningStrikeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </template>
                          </li>
                        </ul>
                      </div>
                    </Transition>
                  </template>
                </li>
              </ul>
              <div v-if="showDetail" class="overlay" @click="toggleDetail"></div>
            </a>
          </div>
          <div v-if="Recorddata !== null && (selectedOption.value === '殺敵最多')" class="col-10 bg-secondary text-white"
            style="text-align: center">
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="color:white; margin-top: 15px; margin-bottom: 15px">擊殺數數量最多</p>
                <li style="margin-bottom: 20px" v-for="(item, key, index) in Recorddatak" :key="key">
                  <template v-if="key !== 'TotalRecord' && index < 3">
                    <button style="background-color:transparent; border:0" type="button" @click="toggleDetail(key)">
                      <a style="color:white;">遊玩日期{{ key }}： 等級：{{ item.Level }}／擊殺數：{{ item.killnumber
                      }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}</a>
                    </button>
                    <Transition>
                      <div v-if="showDetail" class="form-container">
                        <ul class="custom-list">
                          <li v-for="(item, key1) in Recorddatak" :key="key1">
                            <template v-if="key1 === keycheck">
                              <a style="color:black; font-size: 18px;">遊玩日期{{ key1 }}： 等級：{{ item.Level }}／擊殺數：{{
                                item.killnumber }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}<br />
                                <div class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;">習得技能：</div>
                                  </div>
                                  <div class="column">
                                    <div style="text-align: left;">升級詳細：</div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFireBall" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFireBall">火球：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.FireBallDamage && !item.SkillUpgradeRecord.FireballPierce && !item.SkillUpgradeRecord.FireBallProject && !item.SkillUpgradeRecord.FireBallChain"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FireBallDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FireBallDamage * 20 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireballPierce">穿透敵人：{{
                                          item.SkillUpgradeRecord.FireballPierce * 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallProject">發射數量：{{
                                          item.SkillUpgradeRecord.FireBallProject * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallChain">自動追蹤：{{
                                          item.SkillUpgradeRecord.FireBallChain }}<br /></a></div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningBlast" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningBlast">閃電爆破：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.LightningBlastDamage && !item.SkillUpgradeRecord.LightningBlastHit && !item.SkillUpgradeRecord.LightningBlastHitRange && !item.SkillUpgradeRecord.LightningBlastAttackRange"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningBlastDamage * 15 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHit">擊中數量：{{
                                          item.SkillUpgradeRecord.LightningBlastHit * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHitRange">連鎖距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastHitRange * 0.2 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastAttackRange">鎖敵距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastAttackRange * 0.1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getMagicWeapon" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getMagicWeapon">魔法武器：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.MagicWeaponDamage && !item.SkillUpgradeRecord.MagicWeaponNum"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponDamage * 10 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponNum">數量提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponNum * 2 + 1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFlameJet" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFlameJet">噴射火焰：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.FlameJetDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FlameJetDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FlameJetDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getWaterSplash" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getWaterSplash">水花濺射：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.WaterSplashDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.WaterSplashDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.WaterSplashDamage * 20 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getBloodExplode" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getBloodExplode">血液爆發：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.BloodExplodeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.BloodExplodeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.BloodExplodeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningStrike" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningStrike">閃電打擊：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.LightningStrikeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningStrikeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningStrikeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </template>
                          </li>
                        </ul>
                      </div>
                    </Transition>
                  </template>
                </li>
              </ul>
              <div v-if="showDetail" class="overlay" @click="toggleDetail"></div>
            </a>
          </div>
          <div v-if="Recorddata !== null && (selectedOption.value === '金幣最多')" class="col-10 bg-secondary text-white"
            style="text-align: center">
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="color:white; margin-top: 15px; margin-bottom: 15px">獲取金幣最多</p>
                <li style="margin-bottom: 20px" v-for="(item, key, index) in Recorddatam" :key="key">
                  <template v-if="key !== 'TotalRecord' && index < 3">
                    <button style="background-color:transparent; border:0" type="button" @click="toggleDetail(key)">
                      <a style="color:white;">遊玩日期{{ key }}： 等級：{{ item.Level }}／擊殺數：{{ item.killnumber
                      }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}</a>
                    </button>
                    <Transition>
                      <div v-if="showDetail" class="form-container">
                        <ul class="custom-list">
                          <li v-for="(item, key1) in Recorddatam" :key="key1">
                            <template v-if="key1 === keycheck">
                              <a style="color:black; font-size: 18px;">遊玩日期{{ key1 }}： 等級：{{ item.Level }}／擊殺數：{{
                                item.killnumber }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}<br />
                                <div class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;">習得技能：</div>
                                  </div>
                                  <div class="column">
                                    <div style="text-align: left;">升級詳細：</div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFireBall" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFireBall">火球：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.FireBallDamage && !item.SkillUpgradeRecord.FireballPierce && !item.SkillUpgradeRecord.FireBallProject && !item.SkillUpgradeRecord.FireBallChain"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FireBallDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FireBallDamage * 20 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireballPierce">穿透敵人：{{
                                          item.SkillUpgradeRecord.FireballPierce * 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallProject">發射數量：{{
                                          item.SkillUpgradeRecord.FireBallProject * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallChain">自動追蹤：{{
                                          item.SkillUpgradeRecord.FireBallChain }}<br /></a></div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningBlast" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningBlast">閃電爆破：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.LightningBlastDamage && !item.SkillUpgradeRecord.LightningBlastHit && !item.SkillUpgradeRecord.LightningBlastHitRange && !item.SkillUpgradeRecord.LightningBlastAttackRange"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningBlastDamage * 15 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHit">擊中數量：{{
                                          item.SkillUpgradeRecord.LightningBlastHit * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHitRange">連鎖距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastHitRange * 0.2 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastAttackRange">鎖敵距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastAttackRange * 0.1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getMagicWeapon" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getMagicWeapon">魔法武器：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.MagicWeaponDamage && !item.SkillUpgradeRecord.MagicWeaponNum"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponDamage * 10 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponNum">數量提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponNum * 2 + 1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFlameJet" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFlameJet">噴射火焰：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.FlameJetDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FlameJetDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FlameJetDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getWaterSplash" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getWaterSplash">水花濺射：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.WaterSplashDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.WaterSplashDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.WaterSplashDamage * 20 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getBloodExplode" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getBloodExplode">血液爆發：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.BloodExplodeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.BloodExplodeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.BloodExplodeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningStrike" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningStrike">閃電打擊：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.LightningStrikeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningStrikeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningStrikeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </template>
                          </li>
                        </ul>
                      </div>
                    </Transition>
                  </template>
                </li>
              </ul>
              <div v-if="showDetail" class="overlay" @click="toggleDetail"></div>
            </a>
          </div>
          <div v-if="Recorddata !== null && (selectedOption.value === '遊玩時間最長' || selectedOption.value === undefined)"
            class="col-10 bg-secondary text-white" style="text-align: center">
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="color:white; margin-top: 15px; margin-bottom: 15px">存活時間最長</p>
                <li style="margin-bottom: 20px" v-for="(item, key, index) in Recorddatat" :key="key">
                  <template v-if="key !== 'TotalRecord' && index < 3">
                    <button style="background-color:transparent; border:0" type="button" @click="toggleDetail(key)">
                      <a style="color:white;">遊玩日期{{ key }}： 等級：{{ item.Level }}／擊殺數：{{ item.killnumber
                      }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}</a>
                    </button>
                    <Transition>
                      <div v-if="showDetail" class="form-container">
                        <ul class="custom-list">
                          <li v-for="(item, key1) in Recorddatat" :key="key1">
                            <template v-if="key1 === keycheck">
                              <a style="color:black; font-size: 18px;">遊玩日期{{ key1 }}： 等級：{{ item.Level }}／擊殺數：{{
                                item.killnumber }}／金幣：{{ item.money }}／遊玩時長：{{ item.time }}<br />
                                <div class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;">習得技能：</div>
                                  </div>
                                  <div class="column">
                                    <div style="text-align: left;">升級詳細：</div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFireBall" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFireBall">火球：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.FireBallDamage && !item.SkillUpgradeRecord.FireballPierce && !item.SkillUpgradeRecord.FireBallProject && !item.SkillUpgradeRecord.FireBallChain"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FireBallDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FireBallDamage * 20 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireballPierce">穿透敵人：{{
                                          item.SkillUpgradeRecord.FireballPierce * 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallProject">發射數量：{{
                                          item.SkillUpgradeRecord.FireBallProject * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.FireBallChain">自動追蹤：{{
                                          item.SkillUpgradeRecord.FireBallChain }}<br /></a></div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningBlast" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningBlast">閃電爆破：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.LightningBlastDamage && !item.SkillUpgradeRecord.LightningBlastHit && !item.SkillUpgradeRecord.LightningBlastHitRange && !item.SkillUpgradeRecord.LightningBlastAttackRange"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningBlastDamage * 15 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHit">擊中數量：{{
                                          item.SkillUpgradeRecord.LightningBlastHit * 2 + 1 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastHitRange">連鎖距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastHitRange * 0.2 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.LightningBlastAttackRange">鎖敵距離提升：{{
                                          item.SkillUpgradeRecord.LightningBlastAttackRange * 0.1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getMagicWeapon" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getMagicWeapon">魔法武器：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div
                                      v-if="!item.SkillUpgradeRecord.MagicWeaponDamage && !item.SkillUpgradeRecord.MagicWeaponNum"
                                      style="text-align: left;"><a>沒有強化過此武器</a></div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponDamage * 10 }}<br /></a><a
                                        v-if="item.SkillUpgradeRecord.MagicWeaponNum">數量提升：{{
                                          item.SkillUpgradeRecord.MagicWeaponNum * 2 + 1 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getFlameJet" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getFlameJet">噴射火焰：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.FlameJetDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.FlameJetDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.FlameJetDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getWaterSplash" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getWaterSplash">水花濺射：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.WaterSplashDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.WaterSplashDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.WaterSplashDamage * 20 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getBloodExplode" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getBloodExplode">血液爆發：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.BloodExplodeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.BloodExplodeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.BloodExplodeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="item.SkillUpgradeRecord.getLightningStrike" class="skills-container">
                                  <div class="column">
                                    <div style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.getLightningStrike">閃電打擊：<br /></a></div>
                                  </div>
                                  <div class="column">
                                    <div v-if="!item.SkillUpgradeRecord.LightningStrikeDamage" style="text-align: left;">
                                      <a>沒有強化過此武器</a>
                                    </div>
                                    <div v-else style="text-align: left;"><a
                                        v-if="item.SkillUpgradeRecord.LightningStrikeDamage">傷害提升：{{
                                          item.SkillUpgradeRecord.LightningStrikeDamage * 10 }}<br /></a>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </template>
                          </li>
                        </ul>
                      </div>
                    </Transition>
                  </template>
                </li>
              </ul>
              <div v-if="showDetail" class="overlay" @click="toggleDetail"></div>
            </a>
          </div>
          <div v-if="Recorddata !== null" class="col-10 bg-secondary text-white"
            style=" border-bottom-left-radius: 50px;border-bottom-right-radius: 50px;text-align: center;">
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="margin-top: 15px; margin-bottom: 15px">遊玩總計</p>
                <li v-for="(item, key) in Recorddata" :key="key">
                  <template v-if="key === 'TotalRecord'"><a>總紀錄：</a> 總擊殺數：{{ item.totalkillnumber }}／總獲取金幣：{{
                    item.totalmoney }}／總遊玩時長：{{ item.totaltime }}秒／總死亡次數：{{ item.totalDiedTimes }}次
                  </template>
                </li>
              </ul>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div>
      <input type="file" @change="uploadImage" />
    </div>
  </div>
</template>
<style>
.form-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(112, 231, 120);
  padding: 20px;
  z-index: 9999;
  width: 450px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.resizable-image {
  max-width: 500px;
  height: auto;
  margin: 0 auto;
}

.custom-link {
  font-size: 25px;
}

.Font-color {
  color: #2c3e50;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100px;
}

.evenly-spaced-text {
  text-align: center;
  width: 100%;
}

.Serch {
  pointer-events: none;
  opacity: 0.5;
}

.custom-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

button.ban {
  visibility: hidden;
}

a.ban {
  visibility: hidden;
}

.skills-container {
  display: flex;
}

.column {
  flex: 1;
}

.v-enter-active {
  transition: all 0.3s ease-out;
}

.v-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue, get, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from "@/main";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = "首頁";
    next();
  },
  data() {
    return {
      data: {},
      Recorddata: {},
      Recorddatal: {},
      Recorddatam: {},
      Recorddatak: {},
      Recorddatat: {},
      Serchdata: {},
      dataindex: [],
      Recordindex: [],
      Recordindexl: [],
      Recordindexk: [],
      Recordindexm: [],
      Recordindext: [],
      Serchdataindex: [],
      options: [],
      RecordindextimeArray: [],
      RecordindextimeArrayFinal: [],
      newSerch: {
        userId: "",
      },
      userId: null,
      errorMessage: null,
      keycheck: null,
      imageUrl: null,
      selectedOption: "",
      checkuserId: "",
      checkuserIdc: "",
      Serchstatus: false,
      accountexist: false,
      myselfidentity: false,
      showDetail: false,
      RecordLength: 0,
      RecordLengthl: 0,
      RecordLengthk: 0,
      RecordLengthm: 0,
      RecordLengtht: 0,
    };
  },
  mounted() {
    const db = getDatabase(firebaseApp);
    const storedUserData = localStorage.getItem("rememberedUser");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      this.userId = userData.name;
    }
    this.checkuserId = this.userId;
    const SerchRef = firebaseRef(db, `Users/`);
    const dataRef = firebaseRef(db, `Users/${this.checkuserId}`);
    const RecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
    onValue(SerchRef, (snapshot) => {
      const Serchdata = snapshot.val();
      this.Serchdataindex = Object.values(Serchdata);
      this.SerchdataLength = this.Serchdataindex.length;
      this.Serchdata = Serchdata;
      this.listenToDataRef(dataRef);
      this.listenToRecord(RecordRef);
      this.listenToRecordL(RecordRef);
      this.listenToRecordM(RecordRef);
      this.listenToRecordK(RecordRef);
      this.listenToRecordT(RecordRef);
    });
  },
  methods: {
    listenToDataRef(dataRef) {
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        this.dataindex = Object.values(data);
        this.dataLength = this.dataindex.length;
        this.data = data;
        if (this.myselfidentity === false) {
          if (data.Manager === true) {
            this.myselfidentity = true;
          }
        }
        this.options = [
          { value: "等級最高", key: "level" },
          { value: "殺敵最多", key: "kill" },
          { value: "金幣最多", key: "money" },
          { value: "遊玩時間最長", key: "time" },
        ];
      });
    },
    listenToRecord(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddata = snapshot.val();
        if (Recorddata === null || Recorddata === undefined) {
          this.Recorddata = Recorddata;
          return;
        }
        this.Recordindex = Object.values(Recorddata);
        this.RecordLength = this.Recordindex.length;
        this.Recorddata = Recorddata;
        console.log(this.Recorddata);
      });
    },
    listenToRecordL(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddatal = snapshot.val();
        if (Recorddatal === null || Recorddatal === undefined) {
          this.Recorddatal = Recorddatal;
          return;
        }
        const recordArray = Object.entries(Recorddatal).map(([key, value]) => {
          if (key === 'TotalRecord') {
            return null;
          }
          return { key, ...value };
        }).filter(record => record !== null);
        recordArray.sort((a, b) => {
          const LevelA = a.Level;
          const LevelB = b.Level;
          return LevelB - LevelA;
        });
        const recordObject = recordArray.reduce((acc, record) => {
          acc[record.key] = record;
          return acc;
        }, {});
        this.Recordindexl = Object.values(recordObject);
        this.RecordLengthl = this.Recordindexl.length;
        this.Recorddatal = recordObject;
      });
    },
    listenToRecordM(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddatam = snapshot.val();
        if (Recorddatam === null || Recorddatam === undefined) {
          this.Recorddatam = Recorddatam;
          return;
        }
        const recordArray = Object.entries(Recorddatam).map(([key, value]) => {
          if (key === 'TotalRecord') {
            return null;
          }
          return { key, ...value };
        }).filter(record => record !== null);
        recordArray.sort((a, b) => {
          const moneyA = a.money;
          const moneyB = b.money;
          return moneyB - moneyA;
        });
        const recordObject = recordArray.reduce((acc, record) => {
          acc[record.key] = record;
          return acc;
        }, {});
        this.Recordindexm = Object.values(recordObject);
        this.RecordLengthm = this.Recordindexm.length;
        this.Recorddatam = recordObject;
      });
    },
    listenToRecordK(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddatak = snapshot.val();
        if (Recorddatak === null || Recorddatak === undefined) {
          this.Recorddatak = Recorddatak;
          return;
        }
        const recordArray = Object.entries(Recorddatak).map(([key, value]) => {
          if (key === 'TotalRecord') {
            return null;
          }
          return { key, ...value };
        }).filter(record => record !== null);
        recordArray.sort((a, b) => {
          const killnumberA = a.killnumber;
          const killnumberB = b.killnumber;
          return killnumberB - killnumberA;
        });
        const recordObject = recordArray.reduce((acc, record) => {
          acc[record.key] = record;
          return acc;
        }, {});
        this.Recordindexk = Object.values(recordObject);
        this.RecordLengthk = this.Recordindexk.length;
        this.Recorddatak = recordObject;
      });
    },
    listenToRecordT(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddatat = snapshot.val();
        if (Recorddatat === null || Recorddatat === undefined) {
          this.Recorddatat = Recorddatat;
          return;
        }
        const recordArray = Object.entries(Recorddatat).map(([key, value]) => {
          if (key === 'TotalRecord') {
            return null;
          }
          return { key, ...value, time: value.time || "00 : 00" };
        }).filter(record => record !== null);
        recordArray.sort((a, b) => {
          const timeA = this.timeStringToSeconds(a.time);
          const timeB = this.timeStringToSeconds(b.time);
          return timeB - timeA;
        });
        const recordObject = recordArray.reduce((acc, record) => {
          acc[record.key] = record;
          return acc;
        }, {});
        this.Recordindext = Object.values(recordObject);
        this.RecordLengtht = this.Recordindext.length;
        this.Recorddatat = recordObject;
      });
    },
    timeStringToSeconds(timeString) {
      const [minutes, seconds] = timeString.split(":").map(Number);
      const totalSeconds = minutes * 60 + seconds;
      return totalSeconds;
    },
    submitSerch() {
      const db = getDatabase(firebaseApp);
      this.checkuserIdc = this.checkuserId;
      this.checkuserId = this.newSerch.userId;
      for (let i = 0; i < this.SerchdataLength; i++) {
        const SerchpostKeys = Object.keys(this.Serchdata);
        const SerchpostId = SerchpostKeys[i];
        if (this.checkuserId !== SerchpostId) {
          this.accountexist = false;
          this.errorMessage = "This UID does not exist";
        } else if (this.checkuserId === this.userId || this.checkuserIdc === this.checkuserId) {
          this.accountexist = false;
          this.errorMessage = "Duplicate UID cannot be used";
          break;
        } else if (this.checkuserId === SerchpostId) {
          this.accountexist = true; this.errorMessage = ""; break;
        }
      }
      if (this.checkuserId != "" && this.accountexist) {
        if (!this.Serchstatus) {
          this.Serchstatus = !this.Serchstatus;
        }
        const newDataRef = firebaseRef(db, `Users/${this.checkuserId}`);
        const newDataRecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
        this.listenToRecord(newDataRecordRef);
        this.listenToDataRef(newDataRef);
      }
      if (this.errorMessage !== "") {
        this.$toast.error(this.errorMessage, { position: "top", duration: 3000, dismissible: true, });
        this.errorMessage = "";
      }
      this.newSerch.userId = "";
    },
    toggleDetail(key) {
      this.showDetail = !this.showDetail;
      this.keycheck = key;
      console.log(this.keycheck);
    },
    toggleLogin() {
      const db = getDatabase(firebaseApp);
      if (this.Serchstatus) {
        this.Serchstatus = !this.Serchstatus;
        this.checkuserId = this.userId;
        this.Recorddata = null;
        const newDataRef = firebaseRef(db, `Users/${this.checkuserId}`);
        const newDataRecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
        this.listenToRecord(newDataRecordRef);
        this.listenToDataRef(newDataRef);
      }
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const db = getDatabase(firebaseApp);
          const officialRef1 = firebaseRef(db, `Users/${this.checkuserId}/UserImage`);
          const storage = getStorage();
          const imageRef = storageRef(storage, `${this.checkuserId}/${file.name}`);
          await uploadBytes(imageRef, file);
          const downloadURL = await getDownloadURL(imageRef);
          this.imageUrl = downloadURL;
          console.log(this.imageUrl);
          await set(officialRef1, this.imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
    downloadGame() {
      const gameDownloadLink = "https://firebasestorage.googleapis.com/v0/b/game-ab172.appspot.com/o/MageSurvivor-1205.rar?alt=media&token=7f1b51d9-8eeb-4d62-93bf-126b8c71992e";
      const downloadLink = document.createElement('a');
      downloadLink.href = gameDownloadLink;
      downloadLink.target = '_blank';
      downloadLink.download = 'MageSurvivor-1205.rar';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    ban() {
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Users/${this.checkuserId}/UserAvailable`);
      set(officialRef1, false);
      this.toggleLogin();
    },
    unban() {
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Users/${this.checkuserId}/UserAvailable`);
      set(officialRef1, true);
      this.toggleLogin();
    },
    Logout() {
      localStorage.removeItem("rememberedUser");
    }
  },
};
</script>