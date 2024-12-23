import { Alert, View } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { IP } from "../shared/IP";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BarChart, LineChart } from "react-native-chart-kit";

const Stack = createStackNavigator();

export default function DepartmentNavigator(props)
{
    return (
        <Stack.Navigator
        initialRouteName="DepartmentList" 
        screenOptions={{
            headerShown: true,
            title: "Danh mục phòng ban"
        }}>
            <Stack.Screen name="DepartmentList" component={DepartmentList} />
            <Stack.Screen name="DepartmentDetail" component={DepartmentDetail} />
            <Stack.Screen name="AddDepartment" component={AddDepartment} />
            <Stack.Screen name="EditDepartment" component={EditDepartment} />
            <Stack.Screen name="ChartDepartment" component={ChartDepartment} />
        </Stack.Navigator>
    )
}

function DepartmentList(props)
{
    //console.log("DepartmentList rendered!");
    var { navigation } = props;
    var { navigate } = navigation;
    var [ listDepartment, setListDepartment ] = useState([]);
    var [ listScrollDepartment, setListScrollDepartment ] = useState([]);
    var [ currentIndexScroll, setCurrentIndexScroll ] = useState(0);
    var [ originalListDepartment, setOriginalListDepartment ] = useState([]);
    var [ updatedDepartment, setUpdatedDepartment ] = useState({
        DepartmentId: "",
        DepartmentName: "",
        Employees: [],
    });

    useEffect(() => {
        getAllDepartments();
    }, [updatedDepartment])

    function getDepartmentById(id)
    {
        setUpdatedDepartment({a:5});
        //console.log("GetdepartmentByid id:", id);
        fetch(IP + `Department/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            respond.json().then((j) => setUpdatedDepartment(j));
            //console.log("u", updatedDepartment);
        })
    }
    function onScroll(e)
    {
        var { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        //console.log(contentOffset, contentSize, layoutMeasurement);
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20)
        {
            //setCurrentIndexScroll(currentIndexScroll + 4);
            setListScrollDepartment([...listScrollDepartment, ...listDepartment.slice(currentIndexScroll + 1, currentIndexScroll + 5)]);
            setCurrentIndexScroll(currentIndexScroll + 5);
        }
    }

    function getAllDepartments() {
        fetch(IP + "Department", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((respond) => {
                console.log("status code:", respond.status);
                if (respond.status === 200) {
                    return respond.json();
                } else {
                    //throw new Error("Error fetching department information");
                }
            })
            .then((result) => {
                console.log(result);
                setListDepartment(result);
                setListScrollDepartment(result.slice(0, 5));
                setCurrentIndexScroll(4);
                setOriginalListDepartment(result);
            })
            .catch((error) => {
                Alert.alert("Có lỗi khi lấy thông tin phòng ban", "Thông báo");
                console.error(error);
            });
    }
    return (
        <View style = {{ flex: 1 }}>
                <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thống kê" onPress = {() => {
                                navigate("ChartDepartment", {
                                originalListDepartment
                            })
                        }} />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thêm" onPress = {() => {
                            navigate("AddDepartment", {
                                getAllDepartments,
                                getDepartmentById,
                            })
                        }} />
                </View>
                <Text style = {{ textAlign: "center" }}>--------</Text>
                <View style = {{ marginHorizontal: 20 }}>
                    <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Tìm kiếm theo tên</Text>
                    <Input leftIcon={<AntDesign name="search1" size={24} color="black" />}
                        onChangeText={(txt) => {
                            if (txt === "")
                            {
                                setListDepartment(originalListDepartment);
                                return;
                            }
                            const filteredDepartments = originalListDepartment.filter((d) => 
                                d.DepartmentName.toLowerCase().includes(txt.toLowerCase())
                            );
                            setListDepartment(filteredDepartments);
                        }}/>
                </View>
                <View style = {{ marginTop: 20 }}/>
                <ScrollView style={{ borderRadius: 25, backgroundColor: "#F5F5F5",  }} onScroll = {onScroll}>
                    {listScrollDepartment.map((v, i) => <Department item = {v}
                                               getAllDepartments = {getAllDepartments}
                                               getDepartmentById = {getDepartmentById}
                                               navigation = {navigation}
                                               key = {i}/>)}
                </ScrollView>
            </View>
    )
}

function Department(props)
{
    var [ toDelete, setToDelete ] = useState("");
    var { item, navigation, getAllDepartments, getDepartmentById } = props;
    var { navigate, goBack } = navigation;

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa phòng ban ${toDelete}?`, [
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
                fetch(IP + `Department/${addr}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((respond) => {
                    console.log(respond);
                    if (respond.status == 204)
                    {
                        
                        Alert.alert("THÔNG BÁO", `Xóa phòng ban ID ${toDelete} thành công`);
                        getAllDepartments();
                    }
                    else if (respond.status == 404)
                    {
                        Alert.alert("THÔNG BÁO", "không thể xóa phòng ban đang có nhân viên");
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
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã phòng ban:</Text>
                <Text style = {{ fontSize: 20 }}>{item.DepartmentId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên:</Text>
                <Text style = {{ fontSize: 20 }}>{item.DepartmentName}</Text>
            </View>
            <View style = {{ marginVertical: 10 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditDepartment", { item, getAllDepartments, getDepartmentById })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(item.DepartmentId);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("DepartmentDetail", { item });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </View>
    )
}

function DepartmentDetail(props)
{
    var { item } = props.route.params;
    return (
        <SafeAreaView style = {{ paddingHorizontal: 20 }}>
            <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}>Phòng ban {item.DepartmentName}</Text>
            <Text style = {{ textAlign: "center" }}>--------</Text>
            <Text style = {{ textAlign: "center", fontSize: 20 }}>{item.DepartmentId}</Text>
            <View style = {{ marginVertical: 20 }}/>
            {item.Employees.map((v, i) => <Employee e = {v}/>)}
        </SafeAreaView>
    )
}

function Employee(props)
{
    var { e } = props;
    return (
        <View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style = {{ fontSize: 20 }}>Mã NV:</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{e.EmployeeId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style = {{ fontSize: 20 }}>Tên NV:</Text>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>{e.EmployeeName}</Text>
            </View>
            <Text style = {{ textAlign: "center" }}>----------</Text>
        </View>
    )
}

function AddDepartment(props)
{
    var { navigation } = props;
    var { getAllDepartments, getDepartmentById } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ departmentName, setDepartmentName ] = useState("");
    
    function addDepartment()
    {
        if (departmentName == "")
        {
            Alert.alert("Tên phòng ban không được để trống");
            return;
        }
        departmentName = departmentName.trim();

        fetch(IP + `Department/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                DepartmentId: "a",
                departmentName,
            }),
        }).then(async (respond) => {
            //console.log(respond);
            if (respond.status == 201)
            {
                Alert.alert("THÔNG BÁO", "Thêm phòng ban thành công");
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
             }}>Thêm phòng ban</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên phòng ban</Text>
            <Input value={ departmentName }
            onChangeText={(txt) => { setDepartmentName(txt) }}></Input>
            
            <Button title="Thêm" onPress = {() => {
                addDepartment();
                getAllDepartments();
                goBack();
                getDepartmentById("a");
            }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                //getAllDepartments();
                getDepartmentById("a");
            }}/>
            <Button title="Thêm tiếp" onPress = {() => {
                addDepartment();
                setDepartmentName("");
            }} />
        </SafeAreaView>
    )
}

function EditDepartment(props)
{
    var { navigation } = props;
    var { getAllDepartments, item , getDepartmentById } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ departmentName, setDepartmentName ] = useState(item.DepartmentName);
    
    async function editDepartment()
    {
        if (departmentName == "")
        {
            Alert.alert("Tên phòng ban không được để trống");
            return;
        }
        departmentName = departmentName.trim();
        var addr = item.DepartmentId.replaceAll("/", "%2F");
        await fetch(IP + `Department/${addr}?name=${departmentName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Đổi phòng ban thành công");
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
             }}>Chỉnh sửa phòng ban</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên phòng ban</Text>
            <Input value={ departmentName }
            onChangeText={(txt) => { setDepartmentName(txt) }}></Input>
            <View style = {{ marginVertical: 50 }}/>
            <Button title="Sửa" onPress = {() => {
                editDepartment();
                goBack();
                getAllDepartments();
                getDepartmentById(item.DepartmentId.replaceAll("/", "%2F"))
            }} buttonStyle = {{ borderRadius: 15 }} />
            <View style = {{ marginVertical: 10 }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                getAllDepartments();
            }} buttonStyle = {{ borderRadius: 15 }} />
        </SafeAreaView>
    )
}

function ChartDepartment(props)
{
    //console.log(props);
    var { originalListDepartment } = props.route.params;
    console.log("ori", originalListDepartment);
    var listEmployeesOfDepartment = [];
    var listDepartments = [];
    originalListDepartment.forEach((d) => {
        listEmployeesOfDepartment.push(d.Employees.length);
        listDepartments.push(d.DepartmentName);
    })
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
        labels: listDepartments,
        datasets: [
          {
            data: listEmployeesOfDepartment
          }
        ]
    };
    return (
        <View>
            <View style = {{ marginVertical: 20 }} />
            <Text style={{ textAlign: 'center', fontSize: 18, marginVertical: 10 }}>
                Biểu đồ số nhân viên theo phòng ban
            </Text>
            <View style = {{ marginVertical: 20 }} />
            <BarChart style = {{ alignSelf: "center" }}
                        data={data}
                        width={300}
                        yAxisSuffix=" NV"
                        height={300}
                        //yAxisLabel=""
                        
                        chartConfig={chartConfig}
                        verticalLabelRotation={35}
                        
            />
        </View>
    )
}