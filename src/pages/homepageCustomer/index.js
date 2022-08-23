import React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import {Header,Gap,WorkshopComponent} from '../../components'

const HomepageCustomer = ({navigation}) => {
  const nav=()=>{

  }
  return (
    <View style={styles.container}>
      <Gap height={20}/>
      <Header navigation="navigation" name="Home"/>
      <Gap height={30}/>
      <WorkshopComponent onPress={()=>navigation.navigate('CustomerDrawer',{screen:'LaporKerusakkan'})}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
  }
})

export default HomepageCustomer
