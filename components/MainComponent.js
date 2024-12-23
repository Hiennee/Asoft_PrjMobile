import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeNavigator from "./HomeNavigator";
import DepartmentNavigator from "./DepartmentNavigator";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from "@rneui/themed";
import EmployeeNavigator from "./EmployeeNavigator";
import IssueNavigator from "./IssueNavigator";
import PositionNavigator from "./PositionNavigator";
import ProjectNavigator from "./ProjectNavigator";
import TaskNavigator from "./TaskNavigator";

const Stack = createStackNavigator();

function MainNavigator()
{
    return (
        <Stack.Navigator
        initialRouteName="Home"
        screenOptions = {{
            headerShown: false,
        }} 
        >
            <Stack.Screen name="Home" component={HomeNavigator}/>
            <Stack.Screen name="Department" component={DepartmentNavigator}/>
            <Stack.Screen name="Employee" component={EmployeeNavigator}/>
            <Stack.Screen name="Issue" component={IssueNavigator}/>
            <Stack.Screen name="Position" component={PositionNavigator}/>
            <Stack.Screen name="Project" component={ProjectNavigator}/>
            <Stack.Screen name="Task" component={TaskNavigator}/>
        </Stack.Navigator>
    )
}

export default function MainComponent(props)
{
    return (
        <NavigationContainer>
            <MainNavigator />
        </NavigationContainer>
    )
}