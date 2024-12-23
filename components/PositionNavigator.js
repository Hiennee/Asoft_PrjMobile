import { Alert, View } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { IP } from "../shared/IP";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BarChart } from "react-native-chart-kit";

const Stack = createStackNavigator();

export default function PositionNavigator(props)
{
    return (
        <Stack.Navigator
        initialRouteName="PositionList" 
        screenOptions={{
            headerShown: true,
            title: "Danh mục vị trí"
        }}>
            <Stack.Screen name="PositionList" component={PositionList} />
            <Stack.Screen name="PositionDetail" component={PositionDetail} />
            <Stack.Screen name="AddPosition" component={AddPosition} />
            <Stack.Screen name="EditPosition" component={EditPosition} />
            <Stack.Screen name="ChartPosition" component={ChartPosition} />
        </Stack.Navigator>
    )
}

function PositionList(props)
{
    var { navigation } = props;
    var { navigate } = navigation;

    var [ originalListPosition, setOriginalListPosition ] = useState([]);
    var [ listPosition, setListPosition ] = useState([]);
    var [ updatedPosition, setUpdatedPosition ] = useState({});
    var [ filteredPositionName, setFilteredPositionName ] = useState("");

    useEffect(() => {
        getAllPositions();
    }, [ updatedPosition ])

    function getPositionById(id)
    {
        setUpdatedPosition({ a: "a" });
        id = id.toString().replaceAll("/", "%2F");
        //console.log("GetdepartmentByid id:", id);
        fetch(IP + `Position/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            respond.json().then((j) => setUpdatedPosition(j));
            //console.log("u", updatedDepartment);
        })
    }

    async function getAllPositions()
    {
        var respond = await fetch(IP + "Position", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            var result = await respond.json();
            setOriginalListPosition(result);
            setListPosition(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin vị trí", "Thông báo");
    }
    return (
        <SafeAreaView>
                <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thống kê" onPress = {() => {
                                navigate("ChartPosition", {
                                listPosition
                            })
                        }} />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thêm" onPress = {() => {
                            navigate("AddPosition", {
                                getAllPositions,
                                getPositionById,
                            })
                        }} />
                </View>
                <Text style = {{ textAlign: "center" }}>--------</Text>
                <View style = {{ marginTop: 50 }}/>
                <View style = {{ marginHorizontal: 20 }}>
                    <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Tìm kiếm theo tên</Text>
                    <Input leftIcon={<AntDesign name="search1" size={24} color="black" />}
                        onChangeText={(txt) => {
                            if (txt === "")
                            {
                                setListPosition(originalListPosition);
                                return;
                            }
                            const filteredPositions = originalListPosition.filter((p) => 
                                p.PositionName.toLowerCase().includes(txt.toLowerCase())
                            );
                            setListPosition(filteredPositions);
                        }}/>
                </View>
                <ScrollView>
                    {listPosition.map((v, i) => <Position item = {v}
                                               getAllPositions = {getAllPositions}
                                               getPositionById = {getPositionById}
                                               navigation = {navigation}/>)}
                </ScrollView>
            </SafeAreaView>
    )
}

function Position(props)
{
    var [ toDelete, setToDelete ] = useState("");
    var { item, navigation, getAllPositions, getPositionById } = props;
    var { navigate, goBack } = navigation;

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa vị trí ${toDelete}?`, [
        {
            text: "HỦY",
            onPress: () => {}
        },
        {
            text: "OK",
            onPress: () => {
                //console.log("id", toDelete);
                var addr = toDelete.trim().replaceAll("/", "%2F");
                console.log(addr);
                fetch(IP + `Position/${addr}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((respond) => {
                    console.log(respond);
                    if (respond.status == 204)
                    {
                        
                        Alert.alert("THÔNG BÁO", `Xóa vị trí ID ${toDelete} thành công`);
                        getAllPositions();
                    }
                    else if (respond.status == 404)
                    {
                        Alert.alert("Có lỗi không xác định khi xóa vị trí", "Thông báo");
                    }
                }) 
            }
        }], { cancelable: false })
    }

    return (
        <View style={{ flexDirection: "column", justifyContent: "space-evenly", }}>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã vị trí:</Text>
                <Text style = {{ fontSize: 20 }}>{item.PositionId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên vị trí:</Text>
                <Text style = {{ fontSize: 20 }}>{item.PositionName}</Text>
            </View>
            <View style = {{ marginVertical: 10 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditPosition", { item, getAllPositions, getPositionById })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(item.PositionId);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("PositionDetail", { item });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </View>
    )
}

function PositionDetail(props)
{
    var { item } = props.route.params;
    return (
        <SafeAreaView style = {{ paddingHorizontal: 20 }}>
            <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}>Vị trí {item.PositionName}</Text>
            <Text style = {{ textAlign: "center" }}>--------</Text>
            <Text style = {{ textAlign: "center" }}>{item.PositionId}</Text>
            <View style = {{ marginVertical: 20 }}/>
            <Text style = {{ fontStyle: "italic", fontSize: 20 }}>Mô tả:</Text>
            <Text>{item.Description}</Text>
        </SafeAreaView>
    )
}

function AddPosition(props)
{
    var { navigation } = props;
    var { getAllPositions, getPositionById } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ positionName, setPositionName ] = useState("");
    var [ positionDescription, setPositionDescription ] = useState("");
    
    function addPosition()
    {
        if (positionName == "" || positionDescription == "")
        {
            Alert.alert("Tên vị trí, mô tả không được để trống");
            return;
        }
        positionName = positionName.trim();

        fetch(IP + `Position/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                PositionId: "a",
                positionName,
                description: positionDescription
            }),
        }).then(async (respond) => {
            //console.log(respond);
            if (respond.status == 201)
            {
                Alert.alert("THÔNG BÁO", "Thêm vị trí thành công");
                //navigation.goBack();
                //getAllCustomers();
            }
            else
            {
                Alert.alert("THÔNG BÁO", (await respond.json()).msg)
                //navigation.goBack();
            }
        })
    }

    return (
        <SafeAreaView>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Thêm vị trí</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên vị trí</Text>
            <Input value={ positionName }
            onChangeText={(txt) => { setPositionName(txt) }}></Input>
            <Text>Mô tả</Text>
            <Input value={ positionDescription }
            onChangeText={(txt) => { setPositionDescription(txt) }}></Input>
            
            <Button title="Thêm" onPress = {() => {
                addPosition();
                //addPosition();
                goBack();
                getPositionById("a");
                //getAllPositions();
            }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                getPositionById("a");
                //getAllPositions();
            }}/>
            <Button title="Thêm tiếp" onPress = {() => {
                addPosition();
                setPositionName("");
                setPositionDescription("");
            }} />
        </SafeAreaView>
    )
}

function EditPosition(props)
{
    var { navigation } = props;
    var { getAllPositions, getPositionById, item } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ positionName, setPositionName ] = useState(item.PositionName);
    var [ positionDescription, setPositionDescription ] = useState(item.Description);
    
    function editPosition()
    {
        if (positionName == "")
        {
            Alert.alert("Tên vị trí không được để trống");
            return;
        }
        positionName = positionName.trim();
        var addr = item.PositionId.replaceAll("/", "%2F");
        fetch(IP + `Position/${addr}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                positionId: "a",
                positionName,
                Description: positionDescription
            })
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Chỉnh sửa vị trí thành công");
                //navigation.goBack();
                //getAllCustomers();
            }
            else
            {
                Alert.alert("THÔNG BÁO", (await respond.json()).msg)
                //navigation.goBack();
            }
        })
    }

    return (
        <SafeAreaView style = {{ paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Chỉnh sửa vị trí</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên vị trí</Text>
            <Input value={ positionName }
            onChangeText={(txt) => { setPositionName(txt) }}></Input>
            <Text>Mô tả</Text>
            <Input value={ positionDescription }
            onChangeText={(txt) => { setPositionDescription(txt) }}></Input>
            <View style = {{ marginVertical: 50 }} />
            <Button title="Sửa" onPress = {() => {
                editPosition();
                goBack();
                //getAllPositions();
                getPositionById(item.PositionId);
            }} buttonStyle = {{ borderRadius: 15 }}/>
            <View style = {{ marginVertical: 10 }} />
            <Button title="Hủy" onPress = {() => {
                goBack();
                //getAllPositions();
                getPositionById(item.PositionId);
            }} buttonStyle = {{ borderRadius: 15 }}/>
        </SafeAreaView>
    )
}

function ChartPosition(props)
{
    var [ listEmployee, setListEmployee ] = useState([]);
    var { listPosition } = props.route.params;

    useEffect(() => {
        getAllEmployees();
    })

    async function getAllEmployees()
    {
        var respond = await fetch(IP + "Employee", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            var result = await respond.json();
            setListEmployee(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin nhân viên", "Thông báo");
    }
    
    var listPositionName = [];
    var listNumberEmployeeOnPosition = [];

    listPosition.forEach((p) => {
        listPositionName.push(p.PositionName)
        listNumberEmployeeOnPosition.push(listEmployee.filter((e) => e.Position.PositionName == p.PositionName).length); 
    });
    
    const chartConfig = {
        backgroundGradientFrom: "#2a5298",
        backgroundGradientFromOpacity: 0.8,
        backgroundGradientTo: "#1e3c72",
        backgroundGradientToOpacity: 0.9,
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        formatYLabel: (value) => {
            return Math.round(value);
        },
        decimalPlaces: 0,
        yAxisInterval: 1,
        strokeWidth: 2,
        barPercentage: 0.8,
        useShadowColorFromDataset: false
      };
      
    const data = {
        labels: listPositionName,
        datasets: [
          {
            data: listNumberEmployeeOnPosition
          }
        ]
    };
    return (
        <View>
            <View style = {{ marginVertical: 20 }} />
            <Text style={{ textAlign: 'center', fontSize: 18, marginVertical: 10 }}>
                Biểu đồ phân loại số lượng NV theo chức vụ
            </Text>
            <View style = {{ marginVertical: 20 }} />
            <BarChart style = {{ alignSelf: "center" }}
                        data={data}
                        width={350}
                        yAxisSuffix=" NV"
                        height={300}
                        //yAxisLabel=""
                        
                        chartConfig={chartConfig}
                        verticalLabelRotation={35}
            />
        </View>
    )
}