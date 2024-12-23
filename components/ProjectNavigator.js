import { Alert, View } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import { IP } from "../shared/IP";
import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { BarChart } from "react-native-chart-kit";

const Stack = createStackNavigator();

export default function ProjectNavigator(props)
{
    return (
        <Stack.Navigator
        initialRouteName="ProjectList" 
        screenOptions={{
            headerShown: true,
            title: "Danh mục dự án"
        }}>
            <Stack.Screen name="ProjectList" component={ProjectList} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
            <Stack.Screen name="AddProject" component={AddProject} />
            <Stack.Screen name="EditProject" component={EditProject} />
            <Stack.Screen name="ChartProject" component={ChartProject} />
        </Stack.Navigator>
    )
}

function ProjectList(props)
{
    var { navigation } = props;
    var { navigate } = navigation;

    var [ originalListProject, setOriginalListProject ] = useState([]);
    var [ listProject, setListProject ] = useState([]);
    var [ updatedProject, setUpdatedProject ] = useState({});

    var [ filterName, setFilterName ] = useState("");
    var [ filterStatus, setFilterStatus ] = useState("none");
    var [ showFilter, setShowFilter ] = useState(false);

    useEffect(() => {
        getAllProjects();
        //console.log("useeffect project");
    }, [ updatedProject ])

    function getProjectById(id)
    {
        setUpdatedProject({ a: "a" });
        id = id.toString().replaceAll("/", "%2F");
        //console.log("GetdepartmentByid id:", id);
        fetch(IP + `Position/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            respond.json().then((j) => setUpdatedProject(j));
            //console.log("u", updatedDepartment);
        })
    }

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
            setOriginalListProject(result);
            setListProject(result);
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin dự án", "Thông báo");
    }
    return (
        <SafeAreaView>
                <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thống kê" onPress = {() => {
                                navigate("ChartProject", {
                                listProject
                            })
                        }} />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thêm" onPress = {() => {
                            navigate("AddProject", {
                                getAllProjects,
                                getProjectById,
                            })
                        }} />
                </View>
                <Text style = {{ textAlign: "center" }}>--------</Text>
                <View style = {{ marginTop: 30 }}/>
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
                        var filteredStatusProjects = originalListProject.filter((p) => {
                            //console.log("stats");
                            return filterStatus == "none" || p.Status == filterStatus
                        })
                        if (txt === "")
                        {
                            setListProject(filteredStatusProjects);
                            return;
                        }
                        
                        const filteredProjects = filteredStatusProjects.filter((p) => 
                            p.ProjectName.toLowerCase().includes(txt.toLowerCase())
                        );
                        setListProject(filteredProjects);
                    }}/>
                </View>
                {showFilter ? 
                <View>
                    <View style = {{ flexDirection: "row", marginHorizontal: 20, alignItems: "center", justifyContent: "space-between" }}>
                        <Text style = {{ fontSize: 15, fontStyle: "italic" }}>Trạng thái</Text>
                        <Picker selectedValue = {filterStatus} style = {{ width: 200 }}
                        onValueChange={(v, i) =>
                        {
                            const filteredProjectsName = originalListProject.filter((p) => 
                                p.ProjectName.toLowerCase().includes(filterName.toLowerCase())
                            );
                            setFilterStatus(v);
                            
                            if (v == "none")
                            {
                                setListProject(filteredProjectsName);
                            }
                            else
                            {
                                const statusFilteredProjects = filteredProjectsName.filter(
                                    (p) => { console.log("p:", p); return p.Status == v }
                                );
                                setListProject(statusFilteredProjects);
                                //console.log("filter emp", filteredEmployees);
                                //console.log("list emp", listEmployee)
                            }
                        }}>
                            <Picker.Item value="none" label = "[Không]"/>
                            <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                            <Picker.Item value="Planning" label="Lên kế hoạch"/>
                            <Picker.Item value="Doing" label="Đang thực hiện"/>
                            <Picker.Item value="Finished" label="Hoàn thành"/>
                            <Picker.Item value="Canceled" label="Hủy"/>
                        </Picker>
                    </View>
                </View> :
                <View />}
                <ScrollView>
                    {listProject.map((v, i) => <Project item = {v}
                                               getAllProjects = {getAllProjects}
                                               getProjectById = {getProjectById}
                                               navigation = {navigation} 
                                               key = {i}/>)}
                </ScrollView>
            </SafeAreaView>
    )
}

function Project(props)
{
    var [ toDelete, setToDelete ] = useState("");
    var { item, navigation, getAllProjects, getProjectById } = props;
    var { navigate, goBack } = navigation;

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa dự án ${toDelete}?`, [
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
                console.log(addr);
                fetch(IP + `Project/${addr}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((respond) => {
                    console.log(respond);
                    if (respond.status == 204)
                    {
                        
                        Alert.alert("THÔNG BÁO", `Xóa dự án ID ${toDelete} thành công`);
                        getAllProjects();
                    }
                    else if (respond.status == 404)
                    {
                        Alert.alert("THÔNG BÁO", "không thể xóa dự án đang có công việc, vấn đề");
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
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã dự án:</Text>
                <Text style = {{ fontSize: 20 }}>{item.ProjectId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên:</Text>
                <Text style = {{ fontSize: 20 }}>{item.ProjectName}</Text>
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
                    navigate("EditProject", { item, getAllProjects, getProjectById })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(item.ProjectId);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("ProjectDetail", { item });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </View>
    )
}

function ProjectDetail(props)
{
    var { item } = props.route.params;
    return (
        <SafeAreaView>
            <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}>Dự án {item.ProjectName}</Text>
            <Text style = {{ textAlign: "center" }}>--------</Text>
            <Text style = {{ textAlign: "center" }}>{item.ProjectId}</Text>
            <View style = {{ marginVertical: 20 }} />
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Trưởng dự án:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Employee.EmployeeName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Mã NV:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Employee.EmployeeId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Trạng thái:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Status}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Bắt đầu:</Text>
                <Text style = {{ fontSize: 20 }}>{new Date(item.StartDate).toLocaleDateString()}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Kết thúc:</Text>
                <Text style = {{ fontSize: 20 }}>{new Date(item.EndDate).toLocaleDateString()}</Text>
            </View>
        </SafeAreaView>
        
    )
}

function AddProject(props)
{
    var { navigation } = props;
    var { getAllProjects, getProjectById } = props.route.params;
    var { navigate, goBack } = navigation;

    var [ projectName, setProjectName ] = useState("");
    var [ projectStartDate, setProjectStartDate ] = useState(new Date());
    var [ projectEndDate, setProjectEndDate ] = useState(new Date());
    var [ projectEmployeeId, setProjectEmployeeId ] = useState("");
    var [ projectStatus, setProjectStatus ] = useState("");

    var [ listEmployee, setListEmployee ] = useState([]);

    useEffect(() => {
        getAllEmployees();
    }, []);

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
    
    function addProject()
    {
        if (projectName == "")
        {
            Alert.alert("Tên dự án không được để trống");
            return;
        }
        projectName = projectName.trim();

        fetch(IP + `Project/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ProjectId: "a",
                projectName,
                StartDate: projectStartDate,
                EndDate: projectEndDate,
                EmployeeId: projectEmployeeId,
                Status: "NotDone",
            }),
        }).then(async (respond) => {
            //console.log(respond);
            if (respond.status == 201)
            {
                Alert.alert("THÔNG BÁO", "Thêm dự án thành công");
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
             }}>Thêm dự án</Text>
            <View style = {{ marginTop: 10 }}/>
            <Text>Tên dự án</Text>
            <Input value={ projectName }
            onChangeText={(txt) => { setProjectName(txt) }}></Input>
            <Text>Thuộc nhân viên?</Text>
            <Picker selectedValue = { projectEmployeeId } onValueChange={(val, idx) => {
                setProjectEmployeeId(val);
            }}>
                <Picker.Item value="" label="[Không]" />
                {listEmployee.map((v, i) => <Picker.Item value={v.EmployeeId} label={v.EmployeeName}/>)}
            </Picker>
            <Text>Trạng thái</Text>
            <Picker selectedValue = { projectStatus } onValueChange={(val, idx) => {
                setProjectStatus(val);
            }}>
                <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                <Picker.Item value="Planning" label="Lên kế hoạch"/>
                <Picker.Item value="Doing" label="Đang thực hiện"/>
                <Picker.Item value="Finished" label="Hoàn thành"/>
                <Picker.Item value="Canceled" label="Hủy"/>
            </Picker>
            <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5" }}>
                <Text>Ngày bắt đầu</Text>
                <TouchableOpacity
                onPress={() => { DateTimePickerAndroid.open({
                    value: projectStartDate,
                    mode: "datetime",
                    onChange: (e, date) => {
                        setProjectStartDate(date);
                    }
                }) }}>
                    <Entypo name="calendar" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <Input disabled value = { projectStartDate.toDateString() } />
            <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5" }}>
                <Text>Ngày kết thúc</Text>
                <TouchableOpacity
                onPress={() => { DateTimePickerAndroid.open({
                    value: projectEndDate,
                    mode: "datetime",
                    onChange: (e, date) => {
                        setProjectEndDate(date);
                    }
                }) }}>
                    <Entypo name="calendar" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <Input disabled value = { projectEndDate.toDateString() } />
            <Button title="Thêm" onPress = {() => {
                addProject();
                //addProject();
                goBack();
                getProjectById("a");
                //getAllProjects();
            }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                getProjectById("a");
                //getAllProjects();
            }}/>
            <Button title="Thêm tiếp" onPress = {() => {
                addProject();
                setProjectName("");
                setProjectEmployeeId("");
                setProjectStatus("");
                setProjectStartDate(new Date());
                setProjectEndDate(new Date());
            }} />
        </SafeAreaView>
    )
}

function EditProject(props)
{
    var { navigation } = props;
    var { getAllProjects, getProjectById, item } = props.route.params;
    var { navigate, goBack } = navigation;

    var [ projectName, setProjectName ] = useState(item.ProjectName);
    var [ projectStartDate, setProjectStartDate ] = useState(new Date(item.StartDate));
    var [ projectEndDate, setProjectEndDate ] = useState(new Date(item.EndDate));
    var [ projectEmployeeId, setProjectEmployeeId ] = useState(item.EmployeeId);
    var [ projectStatus, setProjectStatus ] = useState(item.Status);

    var [ listEmployee, setListEmployee ] = useState([]);

    useEffect(() => {
        getAllEmployees();
    }, []);

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
    
    function editProject()
    {
        if (projectName == "")
        {
            Alert.alert("Tên dự án không được để trống");
            return;
        }
        projectName = projectName.trim();
        var addr = item.ProjectId.replaceAll("/", "%2F");
        fetch(IP + `Project/${addr}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ProjectId: "a",
                projectName,
                StartDate: projectStartDate,
                EndDate: projectEndDate,
                EmployeeId: projectEmployeeId,
                Status: projectStatus,
            })
        }).then(async (respond) => {
            if (respond.status == 200)
            {
                Alert.alert("THÔNG BÁO", "Thêm dự án thành công");
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
             }}>Chỉnh sửa dự án</Text>
            <View style = {{ marginVertical: 30 }}/>
            <Text>Tên dự án</Text>
            <Input value={ projectName }
            onChangeText={(txt) => { setProjectName(txt) }}></Input>
            <Text>Thuộc nhân viên?</Text>
            <Picker selectedValue = { projectEmployeeId } onValueChange={(val, idx) => {
                setProjectEmployeeId(val);
            }}>
                {listEmployee.map((v, i) => <Picker.Item value={v.EmployeeId} label={v.EmployeeName}/>)}
            </Picker>
            <Text>Trạng thái</Text>
            <Picker selectedValue = { projectStatus } onValueChange={(val, idx) => {
                setProjectStatus(val);
            }}>
                <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                <Picker.Item value="Planning" label="Lên kế hoạch"/>
                <Picker.Item value="Doing" label="Đang thực hiện"/>
                <Picker.Item value="Finished" label="Hoàn thành"/>
                <Picker.Item value="Canceled" label="Hủy"/>
            </Picker>
            <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5" }}>
                <Text>Ngày bắt đầu</Text>
                <TouchableOpacity
                onPress={() => { DateTimePickerAndroid.open({
                    value: projectStartDate,
                    mode: "datetime",
                    onChange: (e, date) => {
                        setProjectStartDate(date);
                    }
                }) }}>
                    <Entypo name="calendar" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <Input disabled value = { projectStartDate.toDateString() } />
            <View style = {{ flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "#F5F5F5" }}>
                <Text>Ngày kết thúc</Text>
                <TouchableOpacity
                onPress={() => { DateTimePickerAndroid.open({
                    value: projectEndDate,
                    mode: "datetime",
                    onChange: (e, date) => {
                        setProjectEndDate(date);
                    }
                }) }}>
                    <Entypo name="calendar" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <Input disabled value = { projectEndDate.toDateString() } />
            
            <Button title="Sửa" onPress = {() => {
                editProject();
                goBack();
                getProjectById(item.ProjectId);
                //getAllProjects();
            }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                getProjectById(item.ProjectId);
                //getAllProjects();
            }}/>
        </SafeAreaView>
    )
}

function ChartProject(props)
{
    var { listProject } = props.route.params;

    var listProjectStatus = [ "NotDone", "Planning", "Doing", "Finished", "Canceled" ];
    var listNumberProjectOnStatus = [];

    listProjectStatus.forEach((p) => {
        listNumberProjectOnStatus.push(listProject.filter((prj) => prj.Status == p).length); 
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
        labels: listProjectStatus,
        datasets: [
          {
            data: listNumberProjectOnStatus
          }
        ]
    };
    return (
        <View>
            <View style = {{ marginVertical: 20 }} />
            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 10 }}>
                Biểu đồ phân loại số lượng dự án theo trạng thái
            </Text>
            <View style = {{ marginVertical: 20 }} />
            <BarChart style = {{ alignSelf: "center" }}
                        data={data}
                        width={350}
                        yAxisSuffix=" Dự án"
                        height={300}
                        //yAxisLabel=""
                        
                        chartConfig={chartConfig}
                        verticalLabelRotation={35}
            />
        </View>
    )
}