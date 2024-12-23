import { Alert, View } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import { IP } from "../shared/IP";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";

const Stack = createStackNavigator();

export default function TaskNavigator(props)
{
    return (
        <Stack.Navigator
        initialRouteName="TaskList" 
        screenOptions={{
            headerShown: true,
            title: "Danh mục tác vụ"
        }}>
            <Stack.Screen name="TaskList" component={TaskList} />
            <Stack.Screen name="TaskDetail" component={TaskDetail} />
            <Stack.Screen name="AddTask" component={AddTask} />
            <Stack.Screen name="EditTask" component={EditTask} />
            <Stack.Screen name="ChartTask" component={ChartTask} />
        </Stack.Navigator>
    )
}

function TaskList(props)
{
    var { navigation } = props;
    var { navigate } = navigation;

    var [ originalListTask, setOriginalListTask ] = useState([]);
    var [ listTask, setListTask ] = useState([]);
    var [ updatedTask, setUpdatedTask ] = useState({});

    var [ filterName, setFilterName ] = useState("");
    var [ filterType, setFilterType ] = useState("none");
    var [ filterStatus, setFilterStatus ] = useState("none");

    var [ showFilter, setShowFilter ] = useState(false);
    
    useEffect(() => {
        getAllTasks();
    }, [ updatedTask ])

    function getTaskById(id)
    {
        setUpdatedTask({ a: "a" });
        id = id.toString().replaceAll("/", "%2F");
        //console.log("GetdepartmentByid id:", id);
        fetch(IP + `Task/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            respond.json().then((j) => setUpdatedTask(j));
            //console.log("u", updatedDepartment);
        })
    }

    async function getAllTasks()
    {
        var respond = await fetch(IP + "Task", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            var result = await respond.json();
            setOriginalListTask(result);
            setListTask(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin tác vụ", "Thông báo");
    }
    return (
        <SafeAreaView>
                <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thống kê" onPress = {() => {
                                navigate("ChartTask", {
                                listTask
                            })
                        }} />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thêm" onPress = {() => {
                            navigate("AddTask", {
                                getAllTasks,
                                getTaskById,
                            })
                        }} />
                </View>
                <Text style = {{ textAlign: "center" }}>--------</Text>
                <View style = {{ marginTop: 50 }}/>
                <View style = {{ marginHorizontal: 20 }}>
                    <View style = {{ flexDirection: "row", justifyContent: "space-between", marginRight: 10 }}>
                        <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Tìm kiếm theo tên</Text>
                        <TouchableOpacity onPress = {() => {
                            setShowFilter(!showFilter);
                            if (showFilter)
                            {
                                setListProject(originalListProject);
                                setFilterStatus("");
                            }
                        }}>
                            <AntDesign name="filter" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                <Input leftIcon={<AntDesign name="search1" size={24} color="black" />}
                    style = {{ marginHorizontal: 50 }}
                    onChangeText={(txt) => {
                        setFilterName(txt);
                        var filteredTasks = originalListTask.filter((t) => {
                            var matchesType = filterType == "none" || t.TaskType == filterType;
                            var matchesStatus = filterStatus == "none" || t.Status == filterStatus;
                            
                            return matchesType && matchesStatus
                        })
                        if (txt === "")
                        {
                            setListTask(filteredTasks);
                            return;
                        }
                        
                        const filteredNameTasks = filteredTasks.filter((t) => 
                            t.TaskName.toLowerCase().includes(txt.toLowerCase())
                        );
                        setListTask(filteredNameTasks);
                    }}/>
                {showFilter ?
                <View>
                    <View style = {{ flexDirection: "column" }}>
                        <View style = {{ flexDirection: "row", marginHorizontal: 20, alignItems: "center", justifyContent: "space-between" }}>
                            <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Loại tác vụ</Text>
                            <Picker selectedValue = {filterType} style = {{ width: 250 }}
                            onValueChange={(v, i) =>
                            {
                                setFilterType(v);
                                //console.log(v);
                                //console.log(v);
                                //console.log("filter dep:", v);
                                var filteredTasks = originalListTask.filter((t) =>
                                {
                                    //console.log(filterPosition === "none")
                                    const matchesName = filterName === "" || t.TaskName.toLowerCase().includes(filterName.toLowerCase());
                                    const matchesStatus = filterStatus === "none" || t.Status == filterStatus;

                                    return matchesName && matchesStatus;
                                });
                                
                                if (v == "none")
                                {
                                    //console.log("v=0")
                                    setListTask(filteredTasks);
                                    //console.log("filter emp", filteredEmployees);
                                    //console.log("list emp", listEmployee)
                                }
                                else
                                {
                                    filteredTasks = filteredTasks.filter(
                                        (t) => t.TaskType == v
                                    );
                                    setListTask(filteredTasks);
                                    //console.log("filter emp", filteredEmployees);
                                    //console.log("list emp", listEmployee)
                                }
                            }}>
                                <Picker.Item value="none" label="[Không]"/>
                                <Picker.Item value="ProjectTask" label="Công việc dự án"/>
                                <Picker.Item value="AriseTask" label="Công việc phát sinh"/>
                            </Picker>
                        </View>
                        <View style = {{ flexDirection: "row", marginHorizontal: 20, alignItems: "center", justifyContent: "space-between" }}>
                            <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Trạng thái</Text>
                            <Picker selectedValue = {filterStatus} style = {{ width: 250 }}
                            onValueChange={(v, i) =>
                            {
                                setFilterStatus(v);
                                //console.log(v);
                                //console.log("filter dep:", v);
                                var filteredTasks = originalListTask.filter((t) =>
                                {
                                    const matchesName = filterName === "" || t.TaskName.toLowerCase().includes(filterName.toLowerCase());
                                    const matchesType = filterType === "none" || t.TaskType == filterType;

                                    return matchesName && matchesType;
                                });
                                
                                if (v == "none")
                                {
                                    //console.log("v=0")
                                    setListTask(filteredTasks);
                                    //console.log("filter emp", filteredEmployees);
                                    //console.log("list emp", listEmployee)
                                }
                                else
                                {
                                    filteredTasks = filteredTasks.filter(
                                        (t) => t.Status == v
                                    );
                                    setListTask(filteredTasks);
                                    //console.log("filter emp", filteredEmployees);
                                    //console.log("list emp", listEmployee)
                                }
                            }}>
                                <Picker.Item value="none" label = "[Không]"/>
                                <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                                <Picker.Item value="Doing" label="Đang thực hiện"/>
                                <Picker.Item value="Finished" label="Hoàn thành"/>
                                <Picker.Item value="Canceled" label="Hủy"/>
                                <Picker.Item value="ReOpen" label="Làm lại"/>
                            </Picker>
                        </View>
                    </View>
                </View>
                : <View />}
                </View>
                <ScrollView>
                    {listTask.map((v, i) => <Task item = {v}
                                               getAllTasks = {getAllTasks}
                                               getTaskById = {getTaskById}
                                               navigation = {navigation}/>)}
                </ScrollView>
            </SafeAreaView>
    )
}

function Task(props)
{
    var [ toDelete, setToDelete ] = useState("");
    var { item, navigation, getAllTasks, getTaskById } = props;
    var { navigate, goBack } = navigation;

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa tác vụ ${toDelete}?`, [
        {
            text: "HỦY",
            onPress: () => {}
        },
        {
            text: "OK",
            onPress: () => {
                //console.log("id", toDelete);
                toDelete = toDelete.trim();
                var addr = toDelete.replaceAll("/", "%2F");
                //console.log(addr);
                fetch(IP + `Task/${addr}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((respond) => {
                    console.log(respond);
                    if (respond.status == 204)
                    {
                        
                        Alert.alert("THÔNG BÁO", `Xóa tác vụ ID ${toDelete} thành công`);
                        getAllTasks();
                    }
                    else if (respond.status == 404)
                    {
                        Alert.alert("THÔNG BÁO", "không thể xóa tác vụ đang có tác vụ");
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
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã tác vụ:</Text>
                <Text style = {{ fontSize: 20 }}>{item.TaskId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên tác vụ:</Text>
                <Text style = {{ fontSize: 20 }}>{item.TaskName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Loại tác vụ:</Text>
                <Text style = {{ fontSize: 20 }}>{item.TaskType}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Trạng thái:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Status}</Text>
            </View>
            <View style = {{ marginVertical: 10 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditTask", { item, getAllTasks, getTaskById })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(item.TaskId);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("TaskDetail", { item });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </View>
    )
}

function TaskDetail(props)
{
    var { item } = props.route.params;
    return (
        <SafeAreaView>
            <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}>Tác vụ {item.TaskName}</Text>
            <Text style = {{ textAlign: "center" }}>--------</Text>
            <Text style = {{ textAlign: "center" }}>{item.TaskId}</Text>
            <View style = {{ marginVertical: 20 }} />
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Loại tác vụ:</Text>
                <Text style = {{ fontSize: 20 }}>{item.TaskType}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Thuộc dự án:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Project == null ? "[Không]" : item.Project.ProjectName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Thuộc nhân viên:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Employee == null ? "[Không]" : item.Employee.EmployeeName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Ngày bắt đầu:</Text>
                <Text style = {{ fontSize: 20 }}>{new Date(item.StartDate).toLocaleDateString()}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Ngày kết thúc:</Text>
                <Text style = {{ fontSize: 20 }}>{new Date(item.EndDate).toLocaleDateString()}</Text>
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

function AddTask(props)
{
    var { navigation } = props;
    var { getAllTasks, getTaskById } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ taskName, setTaskName ] = useState("");
    var [ taskType, setTaskType ] = useState("ProjectTask");
    var [ taskProjectId, setTaskProjectId ] = useState("");
    var [ taskEmployeeId, setTaskEmployeeId ] = useState("");
    var [ taskStartDate, setTaskStartDate ] = useState(new Date());
    var [ taskEndDate, setTaskEndDate ] = useState(new Date());
    var [ taskStatus, setTaskStatus ] = useState("NotDone");
    
    var [ listProject, setListProject ] = useState([]);
    var [ listEmployee, setListEmployee ] = useState([]);
    var [ listTask, setListTask ] = useState([]);

    useEffect(() => {
        getAllEmployees();
        getAllProjects();
    }, []);

    async function getAllProjects()
    {
        var respond = await fetch(IP + "Project", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            var result = await respond.json();
            setListProject(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin dự án", "Thông báo");
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
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin nhân sự", "Thông báo");
    }

    function addTask()
    {
        if (taskName == "")
        {
            Alert.alert("Tên tác vụ không được để trống");
            return;
        }

        fetch(IP + `Task/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                TaskId: "a",
                taskName,
                taskType,
                ProjectId: taskProjectId,
                EmployeeId: taskEmployeeId,
                StartDate: taskStartDate,
                EndDate: taskEndDate,
                Status: taskStatus,
            }),
        }).then(async (respond) => {
            //console.log(respond);
            if (respond.status == 201)
            {
                Alert.alert("THÔNG BÁO", "Thêm tác vụ thành công");
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
        <SafeAreaView style = {{ marginTop: -20 }}>
            <ScrollView>
                <Text style={{ fontWeight: "bold", fontSize: 20,
                            textAlign: "center"
                }}>Thêm tác vụ</Text>
                <View style = {{ marginTop: 10 }}/>
                <Text>Tên tác vụ</Text>
                <Input value={ taskName } style = {{ marginVertical: -10 }}
                onChangeText={(txt) => { setTaskName(txt) }}></Input>
                <Text>Của nhân viên?</Text>
                <Picker selectedValue={ taskEmployeeId } onValueChange={(val, idx) => {
                    setTaskEmployeeId(val);
                }}>
                    <Picker.Item value="" label="[Không]" />
                    {listEmployee.map((v, i) => <Picker.Item value={v.EmployeeId} label={v.EmployeeName}/>)}
                </Picker>
                <Text>Của dự án?</Text>
                <Picker selectedValue= { taskProjectId } onValueChange={(val, idx) => {
                    setTaskProjectId(val);
                }}>
                    <Picker.Item value="" label="[Không]" />
                    {listProject.map((v, i) => <Picker.Item value={v.ProjectId} label={v.ProjectName}/>)}
                </Picker>
                <Text>Loại tác vụ</Text>
                <Picker selectedValue = { taskType } onValueChange={(val, idx) => {
                    setTaskType(val);
                }}>
                    <Picker.Item value="ProjectTask" label="Công việc dự án"/>
                    <Picker.Item value="AriseTask" label="Công việc phát sinh"/>
                </Picker>
                <Text>Trạng thái</Text>
                <Picker selectedValue = { taskStatus } onValueChange={(val, idx) => {
                    setTaskStatus(val);
                }}>
                    <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                    <Picker.Item value="Doing" label="Đang thực hiện"/>
                    <Picker.Item value="Finished" label="Hoàn thành"/>
                    <Picker.Item value="Canceled" label="Hủy"/>
                    <Picker.Item value="ReOpen" label="Làm lại"/>
                </Picker>
                <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5",
                    marginTop: -10
                 }}>
                    <Text>Ngày bắt đầu</Text>
                    <TouchableOpacity
                    onPress={() => { DateTimePickerAndroid.open({
                        value: taskStartDate,
                        mode: "datetime",
                        onChange: (e, date) => {
                            setTaskStartDate(date);
                        }
                    }) }}>
                        <Entypo name="calendar" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
                <Input disabled value = { taskStartDate.toLocaleDateString() } style = {{ marginTop: -10 }}/>
                <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5",
                    marginTop: -20
                 }}>
                    <Text>Ngày kết thúc</Text>
                    <TouchableOpacity
                    onPress={() => { DateTimePickerAndroid.open({
                        value: taskEndDate,
                        mode: "datetime",
                        onChange: (e, date) => {
                            setTaskEndDate(date);
                        }
                    }) }}>
                        <Entypo name="calendar" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
                <Input disabled value = { taskEndDate.toLocaleDateString() } />
                <Button title="Thêm" onPress = {() => {
                    addTask();
                    //addTask();
                    //getAllTasks();
                    getTaskById("a");
                    goBack();
                    
                }}/>
                <Button title="Hủy" onPress = {() => {
                    goBack();
                    //getAllTasks();
                }}/>
                <Button title="Thêm tiếp" onPress = {() => {
                    addTask();
                    setTaskName("");
                    setTaskEmployeeId("");
                    setTaskProjectId("");
                    setTaskType("");
                    setTaskStatus("");
                    setTaskStartDate(new Date());
                    setTaskEndDate(new Date());
                }} />
            </ScrollView>
        </SafeAreaView>
    )
}

function EditTask(props)
{
    var { navigation } = props;
    var { getAllTasks, getTaskById, item } = props.route.params;
    var { navigate, goBack } = navigation;

    var [ taskName, setTaskName ] = useState(item.TaskName);
    var [ taskType, setTaskType ] = useState(item.TaskType);
    var [ taskProjectId, setTaskProjectId ] = useState(item.ProjectId);
    var [ taskEmployeeId, setTaskEmployeeId ] = useState(item.EmployeeId);
    var [ taskStartDate, setTaskStartDate ] = useState(new Date(item.StartDate));
    var [ taskEndDate, setTaskEndDate ] = useState(new Date(item.EndDate));
    var [ taskStatus, setTaskStatus ] = useState(item.Status);
    
    var [ listProject, setListProject ] = useState([]);
    var [ listEmployee, setListEmployee ] = useState([]);
    //var [ listTask, setListTask ] = useState([]);

    useEffect(() => {
        getAllEmployees();
        getAllProjects();
    }, []);

    async function getAllProjects()
    {
        var respond = await fetch(IP + "Project", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (respond.status == 200)
        {
            var result = await respond.json();
            setListProject(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin dự án", "Thông báo");
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
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin nhân sự", "Thông báo");
    }
    
    function editTask()
    {
        if (taskName == "")
        {
            Alert.alert("Tên tác vụ không được để trống");
            return;
        }
        taskName = taskName.trim();
        var addr = item.TaskId.replaceAll("/", "%2F");
        fetch(IP + `Task/${addr}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                TaskId: "a",
                taskName,
                taskType,
                ProjectId: taskProjectId,
                EmployeeId: taskEmployeeId,
                StartDate: taskStartDate,
                EndDate: taskEndDate,
                Status: taskStatus,
            })
        }).then(async (respond) => {
            if (respond.status == 204)
            {
                Alert.alert("THÔNG BÁO", "Chỉnh sửa tác vụ thành công");
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
        <SafeAreaView style = {{ marginTop: -30, paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Chỉnh sửa tác vụ</Text>
            <Text>Tên tác vụ</Text>
            <Input value={ taskName }
            onChangeText={(txt) => { setTaskName(txt) }}></Input>
            <View style = {{ marginVertical: -5 }} />
            <Text>Của nhân viên?</Text>
            <View style = {{ marginVertical: -5 }} />
            <Picker selectedValue={ taskEmployeeId } onValueChange={(val, idx) => {
                setTaskEmployeeId(val);
            }}>
                <Picker.Item value="" label="[Không]" />
                {listEmployee.map((v, i) => <Picker.Item value={v.EmployeeId} label={v.EmployeeName}/>)}
            </Picker>
            <Text>Của dự án?</Text>
            <View style = {{ marginVertical: -5 }} />
            <Picker selectedValue= { taskProjectId } onValueChange={(val, idx) => {
                setTaskProjectId(val);
            }}>
                <Picker.Item value="" label="[Không]" />
                {listProject.map((v, i) => <Picker.Item value={v.ProjectId} label={v.ProjectName}/>)}
            </Picker>
            <Text>Loại tác vụ</Text>
            <View style = {{ marginVertical: -5 }} />
            <Picker selectedValue = { taskType } onValueChange={(val, idx) => {
                setTaskType(val);
            }}>
                <Picker.Item value="ProjectTask" label="Công việc dự án"/>
                <Picker.Item value="AriseTask" label="Công việc phát sinh"/>
            </Picker>
            <Text>Trạng thái</Text>
            <View style = {{ marginVertical: -5 }} />
            <Picker selectedValue = { taskStatus } onValueChange={(val, idx) => {
                setTaskStatus(val);
            }}>
                <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                <Picker.Item value="Doing" label="Đang thực hiện"/>
                <Picker.Item value="Finished" label="Hoàn thành"/>
                <Picker.Item value="Canceled" label="Hủy"/>
                <Picker.Item value="ReOpen" label="Làm lại"/>
            </Picker>
            <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5" }}>
                <Text>Ngày bắt đầu</Text>
                <TouchableOpacity
                onPress={() => { DateTimePickerAndroid.open({
                    value: taskStartDate,
                    mode: "datetime",
                    onChange: (e, date) => {
                        setTaskStartDate(date);
                    }
                }) }}>
                    <Entypo name="calendar" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <View style = {{ marginVertical: -5 }} />
            <Input disabled value = { taskStartDate.toLocaleDateString() } />
            <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5" }}>
                <Text>Ngày kết thúc</Text>
                <TouchableOpacity
                onPress={() => { DateTimePickerAndroid.open({
                    value: taskEndDate,
                    mode: "datetime",
                    onChange: (e, date) => {
                        setTaskEndDate(date);
                    }
                }) }}>
                    <Entypo name="calendar" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <View style = {{ marginVertical: -5 }} />
            <Input disabled value = { taskEndDate.toLocaleDateString() } />
            
            <Button title="Sửa" onPress = {() => {
                editTask();
                goBack();
                getTaskById(item.TaskId);
                //getAllTasks();
            }} buttonStyle = {{ borderRadius: 15 }}/>
            <View style = {{ marginVertical: 10 }} />
            <Button title="Hủy" onPress = {() => {
                goBack();
                getTaskById(item.TaskId);
                //getAllTasks();
            }} buttonStyle = {{ borderRadius: 15 }}/>
        </SafeAreaView>
    )
}

function ChartTask(props)
{
    var { listTask } = props.route.params;

    var listTaskStatus = [ "NotDone", "Doing", "Finished", "Canceled", "ReOpen" ];
    var listNumberTaskOnStatus = [];

    listTaskStatus.forEach((t) => {
        listNumberTaskOnStatus.push(listTask.filter((tsk) => tsk.Status == t).length); 
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
        labels: listTaskStatus,
        datasets: [
          {
            data: listNumberTaskOnStatus
          }
        ]
    };
    return (
        <View>
            <View style = {{ marginVertical: 20 }} />
            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 10 }}>
                Biểu đồ phân loại số lượng tác vụ theo trạng thái
            </Text>
            <View style = {{ marginVertical: 20 }} />
            <BarChart style = {{ alignSelf: "center" }}
                        data={data}
                        width={350}
                        yAxisSuffix=" Tác vụ"
                        height={300}
                        //yAxisLabel=""
                        
                        chartConfig={chartConfig}
                        verticalLabelRotation={35}
            />
        </View>
    )
}