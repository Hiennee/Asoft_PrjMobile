import { Alert, View } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { IP } from "../shared/IP";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";

const Stack = createStackNavigator();

export default function EmployeeNavigator(props)
{
    return (
        <Stack.Navigator
        initialRouteName="EmployeeList" 
        screenOptions={{
            headerShown: true,
            title: "Danh mục nhân viên"
        }}>
            <Stack.Screen name="EmployeeList" component={EmployeeList} />
            <Stack.Screen name="EmployeeDetail" component={EmployeeDetail} />
            <Stack.Screen name="AddEmployee" component={AddEmployee} />
            <Stack.Screen name="EditEmployee" component={EditEmployee} />
            <Stack.Screen name="ChartEmployee" component={ChartEmployee} />
        </Stack.Navigator>
    )
}

function EmployeeList(props)
{
    //console.log("rerender")
    
    var { navigation } = props;
    var { navigate } = navigation;
    var [ showFilter, setShowFilter ] = useState(false);
    var [ listEmployee, setListEmployee ] = useState([]);
    var [ originalListDepartment, setOriginalListDepartment ] = useState([]);
    var [ listDepartment, setListDepartment ] = useState([]);
    var [ listPosition, setListPosition ] = useState([]);

    var [ updatedEmployee, setUpdatedEmployee ] = useState({});
    var [ originalListEmployee, setOriginalListEmployee ] = useState([]);

    var [ filterDepartment, setFilterDepartment ] = useState("none");
    var [ filterPosition, setFilterPosition ] = useState("none");
    var [ filterStatus, setFilterStatus ] = useState("none");
    var [ filterName, setFilterName ] = useState("");
    //console.log("From emplist component list emp", listEmployee)
    useEffect(() => {
        getAllEmployees();
        getAllDepartments();
        getAllPositions();
        
        //console.log('useeffect called');
    }, [ updatedEmployee ])

    function getEmployeeById(id)
    {
        id = id.toString().replaceAll("/", "%2F");
        setUpdatedEmployee({a:5});
        fetch(IP + `Employee/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            respond.json().then((j) => setUpdatedEmployee(j));
            //console.log("u", updatedDepartment);
        })
    }

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
            setOriginalListEmployee(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin nhân viên", "Thông báo");
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
                setOriginalListDepartment(result);
                setListDepartment(result);
                //setOriginalListDepartment(result);
            })
            .catch((error) => {
                Alert.alert("Có lỗi khi lấy thông tin phòng ban", "Thông báo");
                console.error(error);
            });
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
            setListPosition(await respond.json());
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin vị trí", "Thông báo");
    }

    return (
        <SafeAreaView>
                <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thống kê" onPress = {() => {
                                navigate("ChartEmployee", {
                                originalListDepartment
                            })
                        }} />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thêm" onPress = {() => {
                            navigate("AddEmployee", {
                                getAllEmployees,
                                getEmployeeById,
                            })
                        }} />
                </View>
                <Text style = {{ textAlign: "center" }}>--------</Text>
                <View style = {{ marginTop: 20 }}/>
                <View style = {{ marginHorizontal: 20 }}>
                    <View style = {{ flexDirection: "row", justifyContent: "space-between", marginRight: 10 }}>
                        <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Tìm kiếm theo tên</Text>
                        <TouchableOpacity onPress = {() => {
                            setShowFilter(!showFilter);
                            if (showFilter)
                            {
                                setListEmployee(originalListEmployee);
                                setFilterDepartment("");
                                setFilterPosition("");
                                setFilterStatus("");
                            }
                        }}>
                            <AntDesign name="filter" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                <Input leftIcon={<AntDesign name="search1" size={24} color="black" />}
                    style = {{ marginHorizontal: 50 }}
                    onChangeText={(txt) => {
                        if (txt === "")
                        {
                            setListEmployee(originalListEmployee);
                            return;
                        }
                        setFilterName(txt);
                        const filteredEmployees = originalListEmployee.filter((e) => 
                            e.EmployeeName.toLowerCase().includes(filterName.toLowerCase())
                        );
                        setListEmployee(filteredEmployees);
                    }}/>
                </View>
                {showFilter ?
                <View>
                    
                <View style = {{ flexDirection: "column" }}>
                    <View style = {{ flexDirection: "row", marginHorizontal: 20, alignItems: "center", justifyContent: "space-between" }}>
                        <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Phòng ban</Text>
                        <Picker selectedValue = {filterDepartment} style = {{ width: 200 }}
                        onValueChange={(v, i) =>
                        {
                            setFilterDepartment(v);
                            console.log(v);
                            //console.log(v);
                            //console.log("filter dep:", v);
                            const filteredEmployees = originalListEmployee.filter((e) =>
                            {
                                console.log(filterPosition === "none")
                                const matchesName = filterName === "" || e.EmployeeName.toLowerCase().includes(filterName.toLowerCase());
                                const matchesPosition = filterPosition === "none" || e.Position.PositionId == filterPosition;
                                const matchesStatus = filterStatus === "none" || e.Status == filterStatus;

                                return matchesName && matchesPosition && matchesStatus;
                            });
                            
                            if (v == "none")
                            {
                                console.log("v=0")
                                setListEmployee(filteredEmployees);
                                console.log("filter emp", filteredEmployees);
                                console.log("list emp", listEmployee)
                            }
                            else
                            {
                                const departmentFilteredEmployees = filteredEmployees.filter(
                                    (e) => e.Department.DepartmentId == v
                                );
                                setListEmployee(departmentFilteredEmployees);
                                console.log("filter emp", filteredEmployees);
                                console.log("list emp", listEmployee)
                            }
                        }}>
                            <Picker.Item value = "none" label = "[Không]"/>
                            {listDepartment.map((v, i) => <Picker.Item value={v.DepartmentId} label = {v.DepartmentName} />)}
                        </Picker>
                    </View>
                    <View style = {{ flexDirection: "row", marginHorizontal: 20, alignItems: "center", justifyContent: "space-between" }}>
                        <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Chức vụ</Text>
                        <Picker selectedValue = {filterPosition} style = {{ width: 200 }}
                        onValueChange={(v, i) =>
                        {
                            setFilterPosition(v);
                            console.log(v);
                            //console.log("filter dep:", v);
                            const filteredEmployees = originalListEmployee.filter((e) =>
                            {
                                const matchesName = filterName === "" || e.EmployeeName.toLowerCase().includes(filterName.toLowerCase());
                                const matchesStatus = filterStatus === "none" || e.Status == filterStatus;
                                const matchesDepartment = filterDepartment === "none" || e.Department.DepartmentId == filterDepartment;

                                return matchesName && matchesStatus && matchesDepartment;
                            });
                            
                            if (v == "none")
                            {
                                //console.log("v=0")
                                setListEmployee(filteredEmployees);
                                //console.log("filter emp", filteredEmployees);
                                //console.log("list emp", listEmployee)
                            }
                            else
                            {
                                const positionFilteredEmployees = filteredEmployees.filter(
                                    (e) => e.Position.PositionId == v
                                );
                                setListEmployee(positionFilteredEmployees);
                                //console.log("filter emp", filteredEmployees);
                                //console.log("list emp", listEmployee)
                            }
                        }}>
                            <Picker.Item value = "none" label = "[Không]"/>
                            {listPosition.map((v, i) => <Picker.Item value={v.PositionId} label={v.PositionName} />)}
                        </Picker>
                    </View>
                    <View style = {{ flexDirection: "row", marginHorizontal: 20, alignItems: "center", justifyContent: "space-between" }}>
                        <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Trạng thái</Text>
                        <Picker selectedValue = {filterStatus} style = {{ width: 200 }}
                        onValueChange={(v, i) =>
                        {
                            setFilterStatus(v);
                            //console.log(v);
                            //console.log("filter dep:", v);
                            const filteredEmployees = originalListEmployee.filter((e) =>
                            {
                                const matchesName = filterName === "" || e.EmployeeName.toLowerCase().includes(filterName.toLowerCase());
                                const matchesPosition = filterPosition === "none" || e.Position.PositionId == filterPosition;
                                const matchesDepartment = filterDepartment === "none" || e.Department.DepartmentId == filterDepartment;

                                return matchesName && matchesPosition && matchesDepartment;
                            });
                            
                            if (v == "none")
                            {
                                //console.log("v=0")
                                setListEmployee(filteredEmployees);
                                //console.log("filter emp", filteredEmployees);
                                //console.log("list emp", listEmployee)
                            }
                            else
                            {
                                const statusFilteredEmployees = filteredEmployees.filter(
                                    (e) => e.Status == v
                                );
                                setListEmployee(statusFilteredEmployees);
                                //console.log("filter emp", filteredEmployees);
                                //console.log("list emp", listEmployee)
                            }
                        }}>
                            <Picker.Item value = "none" label = "[Không]" />
                            <Picker.Item value = "Active" label = "Hoạt động"/>
                            <Picker.Item value = "Absent" label = "Tạm nghỉ"/>
                            <Picker.Item value = "Inactive" label = "Ngừng hoạt động"/>
                        </Picker>
                    </View>
                </View>
            </View>
            :
            <View />}
                <ScrollView>
                    {listEmployee.map((v, i) => <Employee item = {v}
                                               getAllEmployees = {getAllEmployees}
                                               getEmployeeById = {getEmployeeById}
                                               navigation = {navigation}/>)}
                </ScrollView>
            </SafeAreaView>
    )
}

function Employee(props)
{
    var [ toDelete, setToDelete ] = useState("");
    var { item, navigation, getAllEmployees, getEmployeeById } = props;
    var { navigate, goBack } = navigation;

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa nhân viên ${toDelete}?`, [
        {
            text: "HỦY",
            onPress: () => {}
        },
        {
            text: "OK",
            onPress: () => {
                //console.log("id", toDelete);
                var addr = toDelete.trim().replaceAll("/", "%2F");
                //console.log(addr);
                fetch(IP + `Employee/${addr}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((respond) => {
                    console.log(respond);
                    if (respond.status == 204)
                    {
                        
                        Alert.alert("THÔNG BÁO", `Xóa nhân viên ID ${toDelete} thành công`);
                        getAllEmployees();
                    }
                    else if (respond.status == 404)
                    {
                        Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi xóa nhân viên");
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
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã nhân viên:</Text>
                <Text style = {{ fontSize: 20 }}>{item.EmployeeId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên:</Text>
                <Text style = {{ fontSize: 20 }}>{item.EmployeeName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Phòng ban:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Department.DepartmentName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Chức vụ:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Position.PositionName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tình trạng:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Status}</Text>
            </View>
            <View style = {{ marginVertical: 10 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditEmployee", { item, getAllEmployees, getEmployeeById })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(item.EmployeeId);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("EmployeeDetail", { item });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </View>
    )
}

function EmployeeDetail(props)
{
    var { item } = props.route.params;
    return (
        <SafeAreaView style = {{ paddingHorizontal: 10 }}>
            <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}>Nhân viên {item.EmployeeName}</Text>
            <Text style = {{ textAlign: "center" }}>--------</Text>
            <Text style = {{ textAlign: "center" }}>{item.EmployeeId}</Text>
            <View style = {{ marginVertical: 20 }}/>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Số điện thoại:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Phone}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Phòng ban:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Department.DepartmentName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Vị trí:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Position.PositionName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Trạng thái:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Status}</Text>
            </View>
        </SafeAreaView>
    )
}

function AddEmployee(props)
{
    var { navigation } = props;
    var { getAllEmployees, getEmployeeById } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ listDepartment, setListDepartment ] = useState([]);
    var [ listPosition, setListPosition ] = useState([]);
    var [ employeeName, setEmployeeName ] = useState("");
    var [ employeePhone, setEmployeePhone ] = useState("");
    var [ employeePositionId, setEmployeePositionId ] = useState("");
    var [ employeeDepartmentId, setEmployeeDepartmentId ] = useState("");
    
    useEffect(() => {
        getAllDepartments();
        getAllPositions();
    }, [])

    async function getAllDepartments()
    {
        var respond = await fetch(IP + "Department", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            setListDepartment(await respond.json());
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin phòng ban", "Thông báo");
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
            setListPosition(await respond.json());
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin vị trí", "Thông báo");
    }

    function addEmployee()
    {
        if (employeeName == "" || employeePhone == "" ||
            employeeDepartmentId == "" || employeePositionId == "")
        {
            Alert.alert("Các trường không được để trống");
            return;
        }

        fetch(IP + `Employee/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                EmployeeId: "a",
                employeeName,
                Phone: employeePhone,
                DepartmentId: employeeDepartmentId.replace("/", "%2F"),
                PositionId: employeePositionId.replace("/", "%2F"),
                Status: "Active"
            }),
        }).then(async (respond) => {
            //console.log(respond);
            if (respond.status == 201)
            {
                Alert.alert("THÔNG BÁO", "Thêm nhân viên thành công");
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
             }}>Thêm nhân viên</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên nhân viên</Text>
            <Input value={ employeeName }
            onChangeText={(txt) => { setEmployeeName(txt) }}></Input>
            <Text>Số điện thoại</Text>
            <Input value={ employeePhone } keyboardType="numeric"
            onChangeText={(txt) => { setEmployeePhone(txt) }}></Input>
            <Text>Phòng ban</Text>
            <Picker selectedValue={employeeDepartmentId} onValueChange={(val, idx) => {
                setEmployeeDepartmentId(val);
            }}>
                <Picker.Item value="" label=""/>
                {listDepartment.map((v, i) => <Picker.Item value={v.DepartmentId} label={v.DepartmentName}/>)}
            </Picker>
            <Text>Vị trí</Text>
            <Picker selectedValue={employeePositionId} onValueChange={(val, idx) => {
                setEmployeePositionId(val);
            }}>
                <Picker.Item value="" label=""/>
                {listPosition.map((v, i) => <Picker.Item value={v.PositionId} label={v.PositionName}/>)}
            </Picker>
            <Button title="Thêm" onPress = {() => {
                addEmployee();
                //addEmployee();
                goBack();
                //getAllEmployees();
                getEmployeeById("a")
            }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                getEmployeeById("a")
            }}/>
            <Button title="Thêm tiếp" onPress = {() => {
                addEmployee();
                setEmployeeName("");
                setEmployeePhone("");
                setEmployeeDepartmentId("");
                setEmployeePositionId("");
            }} />
        </SafeAreaView>
    )
}

function EditEmployee(props)
{
    var { navigation } = props;
    var { getAllEmployees, getEmployeeById, item } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ listDepartment, setListDepartment ] = useState([]);
    var [ listPosition, setListPosition ] = useState([]);
    var [ employeeName, setEmployeeName ] = useState(item.EmployeeName);
    var [ employeePhone, setEmployeePhone ] = useState(item.Phone);
    var [ employeePositionId, setEmployeePositionId ] = useState(item.Position.PositionId);
    var [ employeeDepartmentId, setEmployeeDepartmentId ] = useState(item.Department.DepartmentId)
    var [ employeeStatus, setEmployeeStatus ] = useState(item.Status);
    
    useEffect(() => {
        getAllDepartments();
        getAllPositions();
    }, [])

    async function getAllDepartments()
    {
        var respond = await fetch(IP + "Department", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            setListDepartment(await respond.json());
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin phòng ban", "Thông báo");
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
            setListPosition(await respond.json());
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin vị trí", "Thông báo");
    }

    function editEmployee()
    {
        if (employeeName == "" || employeePhone == "")
        {
            Alert.alert("Các trường không được để trống");
            return;
        }
        var addr = item.EmployeeId.replaceAll("/", "%2F");
        console.log({
            EmployeeId: "a",
            employeeName: employeeName.trim(),
            Phone: employeePhone.trim(),
            DepartmentId: employeeDepartmentId.trim().replace("/", "%2F"),
            PositionId: employeePositionId.trim().replace("/", "%2F"),
            Status: employeeStatus,
        });
        fetch(IP + `Employee/${addr}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                EmployeeId: "a",
                employeeName: employeeName.trim(),
                Phone: employeePhone.trim(),
                DepartmentId: employeeDepartmentId.trim().replace("/", "%2F"),
                PositionId: employeePositionId.trim().replace("/", "%2F"),
                Status: employeeStatus,
            })
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Chỉnh sửa nhân viên thành công");
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
             }}>Chỉnh sửa nhân viên</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên nhân viên</Text>
            <Input value={ employeeName } placeholder={item.EmployeeName}
            onChangeText={(txt) => { setEmployeeName(txt) }}></Input>
            <Text>Số điện thoại</Text>
            <Input value={ employeePhone } keyboardType="numeric"
            onChangeText={(txt) => { setEmployeePhone(txt) }}></Input>
            <Text>Phòng ban</Text>
            <Picker selectedValue={employeeDepartmentId} onValueChange={(val, idx) => {
                setEmployeeDepartmentId(val);
            }}>
                {listDepartment.map((v, i) => <Picker.Item value={v.DepartmentId} label={v.DepartmentName}/>)}
            </Picker>
            <Text>Vị trí</Text>
            <Picker selectedValue={employeePositionId} onValueChange={(val, idx) => {
                setEmployeePositionId(val);
            }}>
                {listPosition.map((v, i) => <Picker.Item value={v.PositionId} label={v.PositionName}/>)}
            </Picker>
            <Text>Trạng thái</Text>
            <Picker selectedValue={employeeStatus} onValueChange={(val, idx) => {
                setEmployeeStatus(val);
            }}>
                <Picker.Item value="Active" label="Hoạt động" />
                <Picker.Item value="Absent" label="Tạm nghỉ" />
                <Picker.Item value="Inactive" label="Ngừng hoạt động" />
            </Picker>
            <View style = {{ marginVertical: 20 }} />
            <Button title="Sửa" onPress = {() => {
                editEmployee();
                goBack();
                //getAllEmployees();
                getEmployeeById(item.EmployeeId);
            }} buttonStyle = {{ borderRadius: 15 }}/>
            <View style = {{ marginVertical: 10 }} />
            <Button title="Hủy" onPress = {() => {
                goBack();
                //getAllEmployees();
                getEmployeeById(item.EmployeeId);
            }} buttonStyle = {{ borderRadius: 15 }}/>
        </SafeAreaView>
    )
}

function ChartEmployee(props)
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