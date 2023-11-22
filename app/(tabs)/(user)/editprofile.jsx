import React , { useState } from 'react';
import { Text , StyleSheet,TouchableOpacity, Image, View, TextInput, Switch} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from 'expo-router';


export default function Page() {
  const [first_name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState(''); 
  const [initialVisibility, setInitialVisibility] = useState(true); 
  const [visibility, setVisibility] = useState(initialVisibility);

  const styles = StyleSheet.create({
    fotoProfile: {
      borderRadius: 80,
      width: 140,
      height: 140,
      marginTop: 30,
      marginLeft: 110,
    },
    camera: {
      fontSize: 30,
      color:'black',
      marginLeft: 200,
      marginTop: -26,
    },
    lock: {
      fontSize: 24,
      color:'black',
      marginLeft: 65,
      marginTop: -45,
    },
    input: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      marginTop: 30,
      marginLeft: 150,
      borderRadius: 15,
    },
    input2: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
      marginTop: 40,
      marginLeft: 150,
      borderRadius: 15,
    },
    
    username: {
      fontWeight: 'bold',
      marginLeft: 50,
      marginTop: -40,
    
    },
    pickerContainer: {
      marginLeft: 155,
      marginTop: 40, 
    },

    genere: {
      fontWeight: 'bold',
      marginLeft: 50,
      marginTop: -30,
      
    },
    contrasenya: {
      fontWeight: 'bold',
      marginLeft: 50,
      marginTop: -25,
      marginBottom: 34,
    },
    cancelButton: {
      width: 130, 
      height: 40, 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 40,
      marginTop: 25,
      marginBottom: 10,
    },
    saveButton: {
      width: 130, 
      height: 40, 
      backgroundColor: '#ff6961', 
      borderWidth: 1, 
      borderColor: 'black', 
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6, 
      marginLeft: 220,
      marginTop: -50,
      
    },
    container: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f3f3f3', 
      borderRadius: 8, 
      paddingHorizontal: 14, 
      marginTop: 20,
  },
    icon: {
      marginTop: 15,
      marginLeft: 10,
      
    },
    input3: {
      color: '#333', 
      paddingVertical: 10, 
      padding: 10, 
      fontSize: 12, 
      marginLeft: 150,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 15,
      marginTop: 40,
      width: 200,
      height: 80,
    },
    visibilitatText: {
      fontWeight: 'bold',
      marginLeft: -280,
      marginTop: 20,
    },
    visibilitatButton: {
      marginTop: 20,
    }
    
  });

  const handleSaveChanges = () => {
    const updatedProfile = {
      first_name: first_name,
      bio: bio, 
      username:username,
      visibility: visibility,
      
    };

    fetch('https://cultucat.hemanuelpc.es/users/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Cambios guardados con éxito');
        } else {
          console.error('Error al guardar cambios en el perfil');
        }
      })
      .then((dataFromServer) => {
        setData(dataFromServer);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  };


  return (
  <View>
    <TouchableOpacity >
      <Image
        style={styles.fotoProfile}
        source={{
          uri:
            'https://fotografias.antena3.com/clipping/cmsimages02/2018/04/27/15C4A825-FBD2-49FC-B669-AA3AA7C57CB6/98.jpg?crop=1920,1080,x0,y0&width=1900&height=1069&optimize=high&format=webply',
         }}
      />
      <MaterialIcons
        style={styles.camera}
        name="photo-camera"
        
      />
    </TouchableOpacity>
    <TextInput
        style={styles.input}
        placeholder="nou"
        value={username}
        onChangeText={(text) => setUsername(text)} 
       
    />
    <Text style= {styles.username}>Username: </Text>
    <TextInput
        style={styles.input2}
        placeholder=""
        value={first_name}
        onChangeText={text => setName(text)}
    />
    <Text style= {styles.username}>Nom: </Text>
    <TextInput
        style={styles.input3}
        placeholder=""
        value={bio}
        onChangeText={text => setBio(text)}
    />
    <Text style= {styles.genere}>Bio: </Text>
    <View style={styles.container}>
    <Switch
      style={styles.visibilitatButton}
      value={visibility}
      onValueChange={(newValue) => setVisibility(newValue)} 
    />
    <Text style={styles.visibilitatText}>Visibilitat: </Text>
    </View>
    <Link href={'(user)/user'} replace asChild>
    <TouchableOpacity
        style={styles.cancelButton}
      >
      <Text style={styles.rankingText}>Cancelar</Text>
    </TouchableOpacity>
    </Link>
    
    <Link href={'(user)/user'} replace asChild>
    <TouchableOpacity
        style={styles.saveButton } onPress={handleSaveChanges}
      >
      <Text style={styles.rankingText}>Desar canvis</Text>
    </TouchableOpacity>
    </Link>  
  </View>
  );
   
}