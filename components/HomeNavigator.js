import { View, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
//import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

export default function HomeNavigator(props)
{
    const { navigate } = props.navigation;
    return (
        <SafeAreaView style = {{ flex: 1, backgroundColor: "#29C1C0" }}>
            <Text style = {{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Ứng dụng quản lý doanh nghiệp</Text>
            <View style = {{ marginVertical: 20 }} />
            <View style = {{ backgroundColor: "white", justifyContent: "space-evenly",
                             borderRadius: 25, paddingBottom: 100, 
                            marginHorizontal: 20, paddingHorizontal: 50, paddingVertical: 50 }}>
                <View style = {{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress = {() => {
                        navigate("Department");
                    }}>
                        <View style = {{ flexDirection: "column", justifyContent: "center" }}>
                            <MaterialCommunityIcons name="google-classroom" size={24} color="black" />
                            <Text style = {{ marginLeft: -20 }}>Phòng ban</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("Employee");
                        console.log("clicked");
                    }}>
                        <View style = {{ flexDirection: "column", justifyContent: "center", marginLeft: 20 }}>
                            <MaterialCommunityIcons name="human-dolly" size={24} color="black" />
                            <Text style = {{ marginLeft: -12}}>Nhân sự</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("Issue");
                    }}>
                        <View style = {{ flexDirection: "column", justifyContent: "center", marginLeft: 10 }}>
                            <AntDesign name="exclamation" size={24} color="black" />
                            <Text style = {{ marginLeft: -10 }}>Vấn đề</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {{ marginVertical: 30 }}/>
                <View style = {{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress = {() => {
                        navigate("Position");
                    }}>
                        <View style = {{ flexDirection: "column", justifyContent: "center", marginLeft: -10 }}>
                            <AntDesign name="upcircleo" size={24} color="black" />
                            <Text style = {{ marginLeft: -2 }}>Vị trí</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("Project");
                    }}>
                        <View style = {{ flexDirection: "column", justifyContent: "center", marginLeft: 10 }}>
                            <FontAwesome5 name="project-diagram" size={24} color="black" />
                            <Text>Dự án</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("Task");
                    }}>
                        <View style = {{ flexDirection: "column", justifyContent: "center", marginRight: -30 }}>
                            <FontAwesome5 name="tasks" size={24} color="black" />
                            <Text>Tác vụ</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}