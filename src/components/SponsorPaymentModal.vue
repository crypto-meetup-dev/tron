<template>
  <div class="modal-card autowidth">
    <header class="modal-card-head">
      <p class="modal-card-title">Sponsor {{ countryName }}</p>
    </header>
    <section class="modal-card-body">
      <div class="columns">
        <div class="column">
          <p>To become the new sponsor of {{ countryName }}, you need to pay <strong>{{ `${parseInt(country._nextPrice._hex, 16) / 1000000} TRX` }}</strong>.</p>
        </div>
      </div>
      <div class="columns">
        <div class="column content is-hidden-mobile">
          <h4>Pay with Scatter Desktop</h4>
          <p>Scatter Desktop allows convenient transactions securely.</p>
          <button :class="['button', 'is-white', 'is-rounded', 'is-outlined', { 'is-loading': isScatterPaying }]"
            @click="payWithScatterAsync"
          >
            Pay with Scatter
          </button>
        </div>
        <div class="column content is-hidden-tablet">
          <h4>Pay with Wallet Apps</h4>
          <button :class="['button', 'is-white', 'is-rounded', 'is-outlined', { 'is-loading': isScatterPaying }]"
            @click="payWithScatterAsync"
          >
            Pay in Apps
          </button>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-rounded is-hidden-mobile is-primary" @click="paidWithWalletApp()">I have paid with Wallet Apps</button>
      <button class="button is-rounded is-white is-outlined" type="button" @click="$parent.close()">Close</button>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SimpleWallet from '@/libs/SimpleWallet';
import API from '@/util/api';
import tronApi from '@/util/tronApi';
// import QrCode from '@xkeshi/vue-qrcode';

const walletHelper = new SimpleWallet('Crypto Meetups');

export default {
  name: 'SponsorPaymentModal',
  props: ['countryName', 'country'],
  data: () => ({
    isScatterPaying: false,
  }),
  methods: {
    ...mapActions(['getLangArr']),
    paidWithWalletApp() {
      this.getLangArr();
      this.$toast.open({
        message: this.$t('buy_land_withApp_success'),
        type: 'is-black',
        duration: 5000,
        queue: false,
      });
      this.$parent.close();
    },
    async payWithScatterAsync() {
      this.isScatterPaying = true;
      try {
        tronApi.contract.buy(1).send({
          shouldPollResponse: true,
          callValue: 1048576,
        }).then(resp => {
          console.log(resp, 'resp')
          this.getLangArr();
          this.$dialog.alert({
            type: 'is-black',
            title: this.$t('buy_land_success_alert'),
            message:
              this.$t('buy_land_success_msg'),
            confirmText: this.$t('buy_land_success_comfm'),
          });
          this.$parent.close();
          this.isScatterPaying = false;
          return true;
        })
      } catch (error) {
        let msg;
        if (error.message === undefined) {
          msg = JSON.parse(error).error.details[0].message;
        } else {
          msg = error.message;
        }
        this.$toast.open({
          message: `Transfer failed: ${msg}`,
          type: 'is-danger',
          duration: 3000,
          queue: false,
        });
      }
      this.isScatterPaying = false;
      return null;
    },
  },
};
</script>
<style scoped>
.autowidth {
  width: auto;
}
</style>
