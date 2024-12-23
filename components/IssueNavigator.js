import { Alert, View } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { IP } from "../shared/IP";
import { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { AppContext } from "./AppContext";
import { BarChart } from "react-native-chart-kit";

const Stack = createStackNavigator();

export default function IssueNavigator(props)
{
    return (
        <Stack.Navigator
        initialRouteName="IssueList" 
        screenOptions={{
            headerShown: true,
            title: "Danh mục vấn đề"
        }}>
            <Stack.Screen name="IssueList" component={IssueList} />
            <Stack.Screen name="IssueDetail" component={IssueDetail} />
            <Stack.Screen name="AddIssue" component={AddIssue} />
            <Stack.Screen name="EditIssue" component={EditIssue} />
            <Stack.Screen name="ChartIssue" component={ChartIssue} />
        </Stack.Navigator>
    )
}

function IssueList(props)
{
    var { navigation } = props;
    var { navigate } = navigation;

    var [ originalListIssue, setOriginalListIssue ] = useState([]);
    var [ listIssue, setListIssue ] = useState([]);
    var [ updatedIssue, setUpdatedIssue ] = useState({});
    var [ filterIssueName, setFilterIssueName ] = useState("");
    
    useEffect(() => {
        getAllIssues();
    }, [ updatedIssue ])

    function getIssueById(id)
    {
        setUpdatedIssue({a: "a"});
        id = id.toString().replaceAll("/", "%2F");
        //console.log("GetdepartmentByid id:", id);
        fetch(IP + `Issue/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((respond) => {
            respond.json().then((j) => setUpdatedIssue(j));
            //console.log("u", updatedDepartment);
        })
    }

    async function getAllIssues()
    {
        var respond = await fetch(IP + "Issue", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        //console.log();
        if (respond.status == 200)
        {
            var result = await respond.json();
            setOriginalListIssue(result);
            setListIssue(result);
            return;
        }
        else
        {
            Alert.alert("Có lỗi khi lấy thông tin vấn đề", "Thông báo");
        }
    }
    return (
        <SafeAreaView>
                <View style = {{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thống kê" onPress = {() => {
                                navigate("ChartIssue", {
                                listIssue
                            })
                        }} />
                        <Button buttonStyle={{ marginRight: 50 }} title = "Thêm" onPress = {() => {
                            navigate("AddIssue", {
                                getAllIssues,
                                getIssueById,
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
                                setListIssue(originalListIssue);
                                return;
                            }
                            const filteredIssues = originalListIssue.filter((i) => 
                                i.IssueName.toLowerCase().includes(txt.toLowerCase())
                            );
                            setListIssue(filteredIssues);
                        }}/>
                </View>
                <ScrollView>
                    {listIssue.map((v, i) => <Issue item = {v}
                                               getAllIssues = {getAllIssues}
                                               getIssueById = {getIssueById}
                                               navigation = {navigation}/>)}
                </ScrollView>
            </SafeAreaView>
    )
}

function Issue(props)
{
    var [ toDelete, setToDelete ] = useState("");
    var { item, navigation, getAllIssues, getIssueById } = props;
    var { navigate, goBack } = navigation;

    function alertDelete()
    {
        Alert.alert("THÔNG BÁO", `Bạn có chắc muốn xóa vấn đề ${toDelete}?`, [
        {
            text: "HỦY",
            onPress: () => {}
        },
        {
            text: "OK",
            onPress: () => {
                var addr = toDelete.trim().replaceAll("/", "%2F");
                //console.log(addr);
                fetch(IP + `Issue/${addr}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then((respond) => {
                    console.log(respond);
                    if (respond.status == 204)
                    {
                        Alert.alert("THÔNG BÁO", `Xóa vấn đề ID ${toDelete} thành công`);
                        getAllIssues();
                    }
                    else if (respond.status == 404)
                    {
                        Alert.alert("THÔNG BÁO", "Lỗi khi xóa");
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
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Mã vấn đề:</Text>
                <Text style = {{ fontSize: 20 }}>{item.IssueId}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
                paddingHorizontal: 20
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20 }}>Tên vấn đề:</Text>
                <Text style = {{ fontSize: 20 }}>{item.IssueName}</Text>
            </View>
            <View style = {{ marginVertical: 10 }} />
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Button title="Sửa" color="primary" onPress = {() => {
                    navigate("EditIssue", { item, getAllIssues, getIssueById })
                }}/>
                <Button title="Xóa" color="warning" onPress = {() => {
                    setToDelete(item.IssueId);
                    alertDelete();
                }}/>
                <Button title = "Xem" onPress={() => {
                    navigate("IssueDetail", { item });
                }} />
            </View>
            
            <Text style = {{ textAlign: "center" }}>----------------------</Text>
        </View>
    )
}

function IssueDetail(props)
{
    var { item } = props.route.params;
    return (
        <SafeAreaView style = {{ paddingHorizontal: 25 }}>
            <Text style = {{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}>Vấn đề {item.IssueName}</Text>
            <Text style = {{ textAlign: "center" }}>--------</Text>
            <Text style = {{ textAlign: "center" }}>{item.IssueId}</Text>
            <View style = {{ marginVertical: 20 }} />
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Loại vấn đề:</Text>
                <Text style = {{ fontSize: 20 }}>{item.IssueType}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Ngày báo cáo:</Text>
                <Text style = {{ fontSize: 20 }}>{new Date(item.ReportedDate).toLocaleDateString()}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Đáo hạn:</Text>
                <Text style = {{ fontSize: 20 }}>{new Date(item.Deadline).toLocaleDateString()}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Của nhân viên:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Employee == null ? "[Không]" : item.Employee.EmployeeName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Của dự án:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Project == null ? "[Không]" : item.Project.ProjectName}</Text>
            </View>
            <View style = {{ flexDirection: "row", justifyContent: "space-between",
             }}>
                <Text style = {{ fontWeight: "bold", fontSize: 20,  }}>Của công việc:</Text>
                <Text style = {{ fontSize: 20 }}>{item.Issue == null ? "[Không]" : item.Issue.IssueName}</Text>
            </View>
            <View style = {{ marginVertical: 10 }} />
            <Text style = {{ textAlign: "center"}}>---</Text>
            <Text style = {{ fontWeight: "bold", fontStyle: "italic", fontSize: 20 }}>Chi tiết</Text>
            <Text style = {{ fontSize: 15 }}>{item.Description}</Text>
        </SafeAreaView>
    )
}

function AddIssue(props)
{
    var { navigation } = props;
    var { getAllIssues, getIssueById } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ issueName, setIssueName ] = useState("");
    var [ issueType, setIssueType ] = useState("Error");
    var [ issueDescription, setIssueDescription ] = useState("");
    var [ issueReportedDate, setIssueReportedDate ] = useState(new Date());
    var [ issueDeadline, setIssueDeadline ] = useState(new Date());
    var [ issueEmployeeId, setIssueEmployeeId ] = useState("");
    var [ issueProjectId, setIssueProjectId ] = useState("");
    var [ issueTaskId, setIssueTaskId ] = useState("");
    var [ issueStatus, setIssueStatus ] = useState("");

    var [ listProject, setListProject ] = useState([]);
    var [ listEmployee, setListEmployee ] = useState([]);
    var [ listTask, setListTask ] = useState([]);
    
    var { setListProjectContext, setListEmployeeContext, setListTaskContext } = useContext(AppContext);

    useEffect(() => {
        getAllEmployees();
        getAllTasks();
        getAllProjects();
    }, [])

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
            setListProjectContext(result);
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
            setListEmployeeContext(result)
            return;
        }
        Alert.alert("Có lỗi khi lấy thông tin nhân sự", "Thông báo");
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
            setListTask(result);
            setListTaskContext(result);
            return;
        }
        Alert.alert("Thông báo", "Có lỗi khi lấy thông tin công việc");
    }

    function addIssue()
    {
        if (issueName == "")
        {
            Alert.alert("Thông báo", "Tên vấn đề không được để trống");
            return;
        }
        if ((issueEmployeeId == "" && issueProjectId == "") && issueTaskId == "")
        {
            Alert.alert("Thông báo", "Vấn đề phải thuộc một nhân viên, dự án, hoặc công việc");
            return;
        }
        if (issueEmployeeId == "")
        {
            Alert.alert("Vấn đề phải thuộc một nhân viên");
            return;
        }
        issueName = issueName.trim();
        // console.log({
        //     IssueId: "a",
        //     issueName,
        //     issueType,
        //     ReportedDate: issueReportedDate,
        //     Deadline: issueDeadline,
        //     Description: issueDescription,
        //     Status: "NotDone",
        //     EmployeeId: issueEmployeeId == "" ? null : issueEmployeeId.replace("/", "%2F"),
        //     ProjectId: issueProjectId == "" ? null : issueProjectId.replace("/", "%2F"),
        //     TaskId: issueTaskId == "" ? null : issueTaskId.replace("/", "%2F"),
        // })
        fetch(IP + `Issue/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                IssueId: "a",
                issueName,
                issueType,
                ReportedDate: issueReportedDate,
                Deadline: issueDeadline,
                Description: issueDescription,
                Status: "NotDone",
                EmployeeId: issueEmployeeId == "" ? null : issueEmployeeId.replace("/", "%2F"),
                ProjectId: issueProjectId == "" ? null : issueProjectId.replace("/", "%2F"),
                TaskId: issueTaskId == "" ? null : issueTaskId.replace("/", "%2F"),
            }),
        }).then(async (respond) => {
            //console.log(respond);
            if (respond.status == 201)
            {
                Alert.alert("THÔNG BÁO", "Thêm vấn đề thành công");
                //navigation.goBack();
                //getAllCustomers();
                getAllIssues();
            }
            else
            {
                Alert.alert("THÔNG BÁO", (await respond.json()).msg)
                //navigation.goBack();
            }
        })
    }

    return (
        <SafeAreaView style = {{ marginTop: - 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
            }}>Thêm vấn đề mới</Text>
            <View style = {{ marginTop: 10 }} />
            <Text>Tên vấn đề</Text>
            <Input value={ issueName }
            onChangeText={(txt) => { setIssueName(txt) }}></Input>
            <Text>Chi tiết</Text>
            <Input value={ issueDescription }
            onChangeText={(txt) => { setIssueDescription(txt) }}></Input>
            <Text>Loại vấn đề</Text>
            <Picker selectedValue={issueType} onValueChange={(val, idx) => {
                setIssueType(val);
            }}>
                <Picker.Item value="Error" label="Lỗi"/>
                <Picker.Item value="Improve" label="Cải tiến"/>
                <Picker.Item value="Question" label="Hỏi đáp"/>
                <Picker.Item value="Change" label="Thay đổi"/>
            </Picker>
            <Text>Thuộc nhân viên?</Text>
            <Picker selectedValue={issueEmployeeId} onValueChange={(val, idx) => {
                setIssueEmployeeId(val);
            }}>
                <Picker.Item value="" label="[Không]"/>
                {listEmployee.map((v, i) => <Picker.Item value={v.EmployeeId} label={v.EmployeeName}/>)}
            </Picker>
            <Text>Thuộc dự án?</Text>
            <Picker selectedValue={issueProjectId} onValueChange={(val, idx) => {
                setIssueProjectId(val);
            }}>
                <Picker.Item value="" label="[Không]"/>
                {listProject.map((v, i) => <Picker.Item value={v.ProjectId} label={v.ProjectName}/>)}
            </Picker>
            <Text>Thuộc công việc?</Text>
            <Picker selectedValue={issueTaskId} onValueChange={(val, idx) => {
                setIssueTaskId(val);
            }}>
                <Picker.Item value="" label="[Không]"/>
                {listTask.map((v, i) => <Picker.Item value={v.TaskId} label={v.TaskName}/>)}
            </Picker>
            <Button title="Thêm" onPress = {() => {
                addIssue();
                goBack();
                //console.log(typeof getAllIssues);
                //getAllIssues();
                getIssueById("a");
            }}/>
            <Button title="Hủy" onPress = {() => {
                goBack();
                getIssueById("a");
                //getAllIssues();
            }}/>
            <Button title="Thêm tiếp" onPress = {() => {
                addIssue();
                setIssueName("");
                setIssueDescription("");
                setIssueType("");
                setIssueEmployeeId("");
                setIssueProjectId("");
                setIssueTaskId("");
                //setEmployeeName("");
            }} />
        </SafeAreaView>
    )
}

function EditIssue(props)
{
    var { navigation } = props;
    var { getAllIssues, getIssueById, item } = props.route.params;
    var { navigate, goBack } = navigation;
    var [ issueName, setIssueName ] = useState(item.IssueName);
    var [ issueType, setIssueType ] = useState(item.IssueType);
    var [ issueDescription, setIssueDescription ] = useState(item.Description);
    var [ issueReportedDate, setIssueReportedDate ] = useState(item.ReportedDate);
    var [ issueDeadline, setIssueDeadline ] = useState(item.Deadline);
    var [ issueEmployeeId, setIssueEmployeeId ] = useState(item.EmployeeId == null ? "" : item.EmployeeId);
    var [ issueProjectId, setIssueProjectId ] = useState(item.ProjectId == null ? "" : item.ProjectId);
    var [ issueTaskId, setIssueTaskId ] = useState(item.TaskId == null ? "" : item.TaskId);
    var [ issueStatus, setIssueStatus ] = useState(item.Status);

    var [ listProject, setListProject ] = useState([]);
    var [ listEmployee, setListEmployee ] = useState([]);
    var [ listTask, setListTask ] = useState([]);

    useEffect(() => {
        getAllEmployees();
        getAllTasks();
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
            setListTask(result);
            return;
        }
        Alert.alert("Thông báo", "Có lỗi khi lấy thông tin công việc");
    }
    function editIssue()
    {
        if (issueName == "")
        {
            Alert.alert("Tên vấn đề không được để trống");
            return;
        }
        if (issueDescription == "")
        {
            Alert.alert("Nhập mô tả cho vấn đề");
            return;
        }
        if (issueEmployeeId == "" && issueProjectId == "" && issueTaskId == "")
        {
            Alert.alert("Vấn đề phải thuộc nhân viên, dự án hoặc công việc!");
            return;
        }
        if (issueReportedDate > new Date())
        {
            Alert.alert("Ngày không hợp lệ");
            return;
        }
        issueName = issueName.trim();
        var addr = item.IssueId.replaceAll("/", "%2F");
        console.log(addr);
        fetch(IP + `Issue/${addr}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                issueName,
                issueType,
                Description: issueDescription,
                ReportedDate: issueReportedDate,
                Deadline: issueDeadline,
                Status: issueStatus,
                EmployeeId: issueEmployeeId,
                ProjectId: issueProjectId,
                TaskId: issueTaskId,
                Status: issueStatus
              })
        }).then(async (respond) => {
            if (respond.status == 204)
            {
                Alert.alert("THÔNG BÁO", "Sửa vấn đề thành công");
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
        <SafeAreaView style = {{ marginTop: -20, paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20,
                           textAlign: "center"
             }}>Sửa vấn đề { item.IssueName }</Text>
            <Text style = {{ textAlign: "center" }}>{ item.IssueId }</Text>
            <Text>Tên vấn đề</Text>
            <Input value={ issueName }
            onChangeText={(txt) => { setIssueName(txt) }}></Input>
            <View style = {{ marginTop: -10 }} />
            <Text>Chi tiết</Text>
            <Input value={ issueDescription }
            onChangeText={(txt) => { setIssueDescription(txt) }}></Input>
            <View style = {{ marginTop: -10 }} />
            <Text>Loại vấn đề</Text>
            <Picker selectedValue = {issueType} onValueChange={(val, idx) => {
                setIssueType(val);
            }}>
                <Picker.Item value="Error" label="Lỗi"/>
                <Picker.Item value="Improve" label="Cải tiến"/>
                <Picker.Item value="Question" label="Hỏi đáp"/>
                <Picker.Item value="Change" label="Thay đổi"/>
            </Picker>
            <Text>Thuộc nhân viên?</Text>
            <Picker selectedValue = {issueEmployeeId} onValueChange={(val, idx) => {
                setIssueEmployeeId(val);
            }}>
                <Picker.Item value={issueEmployeeId} label="[Không]"/>
                {listEmployee.map((v, i) => <Picker.Item value={v.EmployeeId} label={v.EmployeeName}/>)}
            </Picker>
            <Text>Thuộc dự án?</Text>
            <Picker selectedValue =  {issueProjectId} onValueChange={(val, idx) => {
                setIssueProjectId(val);
            }}>
                <Picker.Item value={issueProjectId} label="[Không]"/>
                {listProject.map((v, i) => <Picker.Item value={v.ProjectId} label={v.ProjectName}/>)}
            </Picker>
            <Text>Thuộc công việc?</Text>
            <Picker selectedValue = {issueTaskId} onValueChange={(val, idx) => {
                setIssueTaskId(val);
            }}>
                <Picker.Item value={issueTaskId} label="[Không]"/>
                {listTask.map((v, i) => <Picker.Item value={v.TaskId} label={v.TaskName}/>)}
            </Picker>
            <Text>Trạng thái</Text>
            <Picker selectedValue = {issueStatus} onValueChange={(val, idx) => {
                setIssueType(val);
            }}>
                <Picker.Item value="NotDone" label="Chưa thực hiện"/>
                <Picker.Item value="Doing" label="Đang thực hiện"/>
                <Picker.Item value="Finished" label="Hoàn thành"/>
                <Picker.Item value="Canceled" label="Hủy"/>
                <Picker.Item value="ReOpen" label="Làm lại"/>
            </Picker>
            <Button title="Sửa" onPress = {() => {
                editIssue();
                goBack();
                getIssueById(item.IssueId);
                //getAllIssues();
            }} buttonStyle = {{ borderRadius: 15 }}/>
            <View style = {{ marginTop: 10 }} />
            <Button title="Hủy" onPress = {() => {
                goBack();
            }} buttonStyle = {{ borderRadius: 15 }}/>
        </SafeAreaView>
    )
}

function ChartIssue(props)
{
    //console.log(props);
    var { listIssue } = props.route.params;
    //console.log("ori", originalListDepartment);
    var issueTypes = [ "Error", "Improve", "Question", "Change"];
    var listIssueTypesNumber = [listIssue.filter((i) => i.IssueType == "Error").length,
                                listIssue.filter((i) => i.IssueType == "Improve").length,
                                listIssue.filter((i) => i.IssueType == "Question").length,
                                listIssue.filter((i) => i.IssueType == "Change").length
    ];
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
        labels: issueTypes,
        datasets: [
          {
            data: listIssueTypesNumber
          }
        ]
    };
    return (
        <View>
            <View style = {{ marginVertical: 20 }} />
            <Text style={{ textAlign: 'center', fontSize: 18, marginVertical: 10 }}>
                Biểu đồ phân loại vấn đề
            </Text>
            <View style = {{ marginVertical: 20 }} />
            <BarChart style = {{ alignSelf: "center" }}
                        data={data}
                        width={350}
                        yAxisSuffix=" Vấn đề"
                        height={300}
                        //yAxisLabel=""
                        
                        chartConfig={chartConfig}
                        verticalLabelRotation={35}
            />
        </View>
    )
}