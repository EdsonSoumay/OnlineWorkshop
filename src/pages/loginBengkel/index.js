import React, {useState,useContext} from 'react'
import {ImageBackground,View,Text,StyleSheet,Dimensions} from 'react-native'
import {LoginBackground,Logo} from '../../assets'
import {Input,Gap,Button} from '../../components'
import {AuthContext} from '../../config/authContext'
import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {isValidObjField,updateError,isValidEmail} from '../../config/validator'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const LoginBengkel = ({navigation}) => {
  const {isFetching,dispatch} = useContext(AuthContext)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState("")

  const submit = ()=>{
    firestore().collection('users')
    // .orderBy('email')
    .where('role','==','bengkel')
    .where('email','==',email)
    // .where('password','==',password)
    .get()
    .then((data)=>{
      // console.log(data._docs);
      if (data._docs == null||[]) {
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2: 'account is not registered'
        });
        // return false;
      }

      if (data._docs != null||[]) {
        data._changes.forEach(async(item)=> {
          // console.log(item._nativeData.doc.data);
          const datas = []
          if(item._nativeData.doc.data.password[1] != password){
            console.log("Invalid Password!");
            Toast.show({
              type: 'error',
              text1: 'Nope!',
              text2: 'Invalid Password!'
            });
            return false
          }
          dispatch({ type: "LOGIN_SUCCESS", payload: item });
          Toast.show({
            type: 'success',
            text1: 'Yeay!',
            text2: 'account has been login 👋'
          });
          const jsonValue = JSON.stringify(data, (key, val)=>{
            if (val != null && typeof val == "object") {
              if (datas.indexOf(val) >= 0) {
                return;
              }
              datas.push(val);
            }
            return val;
          });
          // console.log(item._nativeData.doc.path.split('/'));
          await AsyncStorage.setItem('@user',jsonValue)
          // await AsyncStorage.removeItem('@user')

          setTimeout(()=>{
            navigation.navigate('Root',{screen:'HomeScreen'})
          },3000)
          console.log(true);
        });
      }
    }).catch(e=>{
      dispatch({ type: "LOGIN_FAILURE", payload: e });
    })
  }

  const validation = ()=>{
    if(!isValidObjField({email,password}))
      return updateError("Fields can't be empty",setMessage)
    if(!isValidEmail(email))
      return updateError("Email address must contains '@'",setMessage)
    if(email.length < 8)
      return updateError("Email length must be 8 or more characters")
    if(!password.trim() || password.length < 6 )
      return updateError("Password must have min 6 characters",setMessage)

    return true
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={LoginBackground} resizeMode="cover" style={styles.image}>
        <View style={styles.blurBackground}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:"center"}}>
            <Logo height={70} width={70}/>
            <Text style={{color:'#000000',fontSize:24,fontFamily:"Nunito-Bold",marginLeft:15}}>Montir</Text>
          </View>
          <Text style={styles.title}>Masuk</Text>
          {message ? <Text style={{color:'#000'}}>{message}</Text> : null}
          <Input setLabel={true} color="#000" label="Email" borderRadius={10} width={width/1.22} defaultValue={email} onChangeText={(value)=>setEmail(value)}/>
          <Gap height={40}/>
          <Input setLabel={true} color="#000" label="Password" borderRadius={10} width={width/1.22} secureTextEntry={true} defaultValue={password} onChangeText={(value)=>setPassword(value)}/>
          <Gap height={15}/>
          <Button name='Lupa password?' color='#000' fam='Nunito-Bold'/>
          <Gap height={60}/>
          <View style={styles.btnContainer}>
            <View>
              <Text style={{color:'#777'}}>Pengguna baru?</Text>
              <Button name='Daftar' color='#000' fam='Nunito-Bold' onPress={()=>navigation.navigate('RegisterBengkel')}/>
            </View>
            <Button name='Masuk' color='#000' fam='Nunito-Regular' size={20} style={styles.btnSubmit} onPress={submit}/>
          </View>
        </View>
        <Toast autoHide={true} visibilityTime={2000}/>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  image:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  blurBackground:{
    width: width/1.12,
    height: height/1.15,
    backgroundColor: 'rgba(255, 252, 252, 0.82)',
    borderRadius:15,
    padding:15,
    position:'relative'
  },
  title:{
    fontFamily:'Nunito-Bold',
    fontSize:36,
    color:'#000',
    marginTop:30,
    marginBottom:30
  },
  btnSubmit:{
    marginBottom:15,
    height:60,
    width:100,
    borderStyle:'solid',
    borderWidth:1,
    borderColor:'#000',
    borderRadius:7,
    alignItems:'center',
    justifyContent:'center',
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'space-between'
  }
})

export default LoginBengkel
