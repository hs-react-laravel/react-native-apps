import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Image, Alert,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import GlobalState from '../../mobx/GlobalState';
import PropTypes from 'prop-types';
import {
  alertNetworkError,
  Net,
  requestGet,
  requestPost,
  requestUpload,
} from '../../utils/ApiUtils';
import CarryingDetailModal from '../../components/container/CarryingDetailModal';
import CalculationDetailModal from '../../components/container/CalculationDetailModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  contentCoupon: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  contentCarrying: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
    marginLeft: 80,
    marginRight: 80,
    padding: 10,
  },
  contentBottle: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

class LinkText extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#ddddff'}
        onPress={this.props.onPress}>
        <Text style={MyStyles.link}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

LinkText.propsType = {
  text: PropTypes.string.isRequired,
};

export default class MemberDetail extends Component {
  state = {
    data: {
      code: '',
      first_name: '',
      last_name: '',
      first_huri: '',
      last_huri: '',
      category: '',
      birthday: '',
      address: '',
      tel_no: '',
      email: '',
      member_no: '',
    },
    bottleInputData: [],
    carryingData: [],
    lastCarryingDate: [],
    carryingCount: 0,
    myShopData: [],
    couponData: [],
    calculationData: [],
    calculationGoods: [],
    sum1: 0,
    sum2: 0,
    myShop: '',
    bottleRemain: 0,
    couponModalVisible: false,
    carryingModalVisible: false,
    carryingDetailModalVisible: false,
    carryingDetailData: [],
    calculationModalVisible: false,
    bottleModalVisible: false,
  };

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('willFocus', () => {
      requestPost(Net.member.get, {
        id: this.props.navigation.state.params.memberId,
      })
        .then(json => {
          this.setState({
            data: json.data,
            bottleInputData: json.bottleInputData,
            bottleRemain: json.bottleRemain,
            carryingData: json.carryingData,
            carryingCount: json.carryingCount,
            lastCarryingDate: json.lastCarryingDate,
            myShopData: json.myShopData,
            myShop: json.myShop,
            couponData: json.couponData,
            calculationData: json.calculationData,
          });
        })
        .catch(err => {
          alertNetworkError(err);
        });
    });
  }
  componentWillUnmount() {
    this.refresh.remove();
  };

  toggleCarryingDetailModal(visible, carrying_id) {
    let tmpCarrying = this.state.carryingData.find(d => {
      return d.id === carrying_id;
    });
    this.cdModal.setState({modal_data: tmpCarrying});
    this.cdModal.doModal();
  }

  toggleCalculationDetailModal(visible, calculation_id, sum1, sum2, name) {
    requestPost(Net.calculation.get_goods, {
      id: calculation_id,
    })
      .then(json => {
        this.calcModal.setState({
            goodsData: json.goodsData,
            calulation_id: calculation_id,
            sum1: sum1,
            sum2: sum2,
            name: name,
            calcSheet: 1,
          },
          () => {
          this.calcModal.doModal();
        });
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 6}}>
        <View
          style={[
            styles.container,
            {marginTop: 20, marginLeft: 20, marginRight: 20},
          ]}>
          <Modal transparent={true} visible={this.state.couponModalVisible}>
            <View style={MyStyles.Modal}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginRight: 5,
                }}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({couponModalVisible: false});
                  }}
                />
              </View>
              <View>
                <Text style={{fontSize: 30, textAlign: 'center'}}>??????????????????</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  margin: 15,
                  padding: 1,
                  borderWidth: 1,
                  backgroundColor: 'white',
                }}>
                <ScrollView>
                  {this.state.couponData.map((item, index) => (
                    <View style={styles.contentCarrying}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={{uri: item.image_path}}
                          style={{flex: 1, height: 40, marginRight: 10}}
                          resizeMode={'contain'}
                        />
                        <Text
                          style={{flex: 2, fontSize: 16, textAlign: 'left'}}>
                          {item.title}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#D0CECE',
                            marginRight: 10,
                          }}>
                          <Text style={styles.modalText}>{item.from_date}~{item.to_date}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          <Modal transparent={true} visible={this.state.carryingModalVisible}>
            <View style={MyStyles.Modal}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginRight: 5,
                }}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({carryingModalVisible: false});
                  }}
                />
              </View>
              <View>
                <Text style={{fontSize: 30, textAlign: 'center'}}>??????????????????</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  margin: 15,
                  padding: 1,
                  borderWidth: 1,
                  backgroundColor: 'white',
                }}>
                <ScrollView>
                  {this.state.carryingData.map((item, index) => (
                    <View style={styles.contentCarrying}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={{uri: item.image_path}}
                          style={{flex: 1, height: 40, marginRight: 10}}
                          resizeMode={'contain'}
                        />
                        <Text
                          style={{flex: 2, fontSize: 16, textAlign: 'left'}}>
                          {item.goods}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#D0CECE',
                            marginRight: 10,
                          }}>
                          <Text style={styles.modalText}>????????????{item.date}</Text>
                        </View>
                        <LinkText
                          text={'?????????'}
                          onPress={() => {
                            this.toggleCarryingDetailModal(true, item.id);
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          <Modal transparent={true} visible={this.state.bottleModalVisible}>
            <View style={MyStyles.Modal}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginRight: 5,
                }}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({bottleModalVisible: false});
                  }}
                />
              </View>
              <View style={{flex: 8, flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>???????????????</Text>
                  <View
                    style={{
                      flex: 6,
                      width: '90%',
                      marginLeft: 10,
                      marginRight: 10,
                      backgroundColor: '#FFE699',
                    }}>
                    <ScrollView>
                      {this.state.bottleInputData.map((item, index) => (
                        <View style={styles.contentBottle}>
                          <Text style={styles.modalText}>?????????????????????{item.name}???</Text>
                          <Text style={styles.modalText}>{item.amount}cc???{item.date}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={{flex: 1}} />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>????????????????????????</Text>
                  <View
                    style={{
                      flex: 6,
                      width: '90%',
                      marginLeft: 10,
                      marginRight: 10,
                      backgroundColor: '#FFE699',
                    }}>
                    <ScrollView>
                      {this.state.myShopData.map((item, index) =>
                        <View style={styles.contentBottle}>
                          <Text style={styles.modalText}>{item.name}</Text>
                          <Text style={styles.modalText}>{item.date}</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                  <View style={{flex: 1}} />
                </View>
              </View>
            </View>
          </Modal>
          <CarryingDetailModal ref={ref => (this.cdModal = ref)} />
          <Modal
            transparent={true}
            visible={this.state.calculationModalVisible}>
            <View style={MyStyles.Modal}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginRight: 5,
                }}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({calculationModalVisible: false});
                  }}
                />
              </View>
              <View>
                <Text style={{fontSize: 30, textAlign: 'center'}}>????????????</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  margin: 15,
                  padding: 1,
                  borderWidth: 1,
                  backgroundColor: 'white',
                }}>
                <ScrollView>
                  {this.state.calculationData.map((item, index) => (
                    <View style={styles.contentCarrying}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{flex: 1, fontSize: 16, textAlign: 'center'}}>
                          ??????1 - {item.sum1}
                        </Text>
                        <Text
                          style={{flex: 1, fontSize: 16, textAlign: 'center'}}>
                          ??????2 - {item.sum2}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#D0CECE',
                            marginRight: 10,
                          }}>
                          <Text style={styles.modalText}>?????????{item.date}</Text>
                        </View>
                        <LinkText
                          text={'?????????'}
                          onPress={() => {
                            this.toggleCalculationDetailModal(
                              true,
                              item.id,
                              item.sum1,
                              item.sum2,
                              this.state.data.first_name + ' ' +
                                this.state.data.last_name,
                            );
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          <CalculationDetailModal ref={ref => (this.calcModal = ref)} />
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <ButtonEx
              onPress={() => this.props.navigation.navigate('Main')}
              style={{borderWidth: 0}}
              text={'TOP'}
              textStyle={{fontSize: 12, lineHeight: 12}}
              icon={'home'}
              iconSize={30}
              vertical={true}
            />
          </View>
          <View
            style={[
              styles.container,
              {
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              },
            ]}>
            <Text>
              {this.state.data.first_huri} {this.state.data.last_huri + '       '}
            </Text>
            <Text style={{fontSize: 30}}>
              {this.state.data.first_name} {this.state.data.last_name} ???
            </Text>
            <Text>????????????: {this.state.data.member_no}</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <ButtonEx
              onPress={() =>
                this.props.navigation.navigate('CarryingRegister', {
                  memberId: this.props.navigation.state.params.memberId,
                })
              }
              text={'????????????'}
              type={'danger'}
            />
          </View>
        </View>
        <View
          style={[
            styles.container,
            {
              margin: 20,
              flex: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              padding: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>????????????</Text>
            <Text>????????????: {this.state.data.category}</Text>
            <Text>????????????: {this.state.data.birthday}</Text>
            <Text>??????: {this.state.data.address}</Text>
            <Text>????????????: {this.state.data.tel_no}</Text>
            <Text>?????????????????????: {this.state.data.email}</Text>
            <Text>???????????????: **********</Text>
            <LinkText
              text={'???????????????'}
              onPress={() => {
                this.props.navigation.navigate('MemberRegister', {
                  memberId: this.props.navigation.state.params.memberId,
                  memberData: this.state.data,
                });
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              padding: 20,
              justifyContent: 'space-around',
            }}>
            <ButtonEx
              onPress={() =>
                this.props.navigation.navigate('BottleManager', {
                  memberId: this.props.navigation.state.params.memberId,
                })
              }
              text={
                '??????????????????\n?????? ' +
                this.state.bottleRemain +
                'cc\n' +
                GlobalState.shopName
              }
              type={'warning'}
              textStyle={{fontSize: 14}}
              image={require('../../../assets/bottle.png')}
            />
            <LinkText
              text={'?????????????????????'}
              onPress={() => {
                this.setState({couponModalVisible: true});
              }}
            />
            <LinkText
              text={'?????????????????????'}
              onPress={() => {
                this.setState({carryingModalVisible: true});
              }}
            />
            <LinkText
              text={'???????????????????????????????????????????????????'}
              onPress={() => {
                this.setState({bottleModalVisible: true});
              }}
            />
            <LinkText
              text={'???????????????'}
              onPress={() => {
                this.setState({calculationModalVisible: true});
              }}
            />
            <Text>
              ???????????????:{' '}
              {this.state.lastCarryingDate
                ? this.state.lastCarryingDate.date
                : ''}
            </Text>
            <Text>????????????: {this.state.carryingCount}</Text>
            <Text>
              ??????????????????: {this.state.myShop ? this.state.myShop.name : null}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
