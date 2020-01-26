module.exports.constants = {

    pushEnv:{
        //"env": "prod"
        "env": "sandbox"
    },

    setting: {
        "SAVED_SETITING" : "Setting saved successfully.",
        "UPDATED_SETITING" : "Setting updated successfully.",
        "DISTANCE" : 25000,
        "SHOPPING_AVAILABLE" : "Product Available",
        "SHOPPING_NOT_AVAILABLE" : "Product Not Available",
    },

    messages : {
        //Registration and Login
        "FIRSTNAME_REQUIRED": "Firstname is required",
        "LASTNAME_REQUIRED": "Lastname is required",
        "USERNAME_REQUIRED": "Email is required",
        "MOBILE_REQUIRED": "Mobile is required",
        "PASSWORD_REQUIRED": "Password is required",
        "USER_EXIST":"Email already exists.",
        "SLUG_EXIST":"Slug already exists.",
        "EMAIL_EXIST":"Email-Id already exists.",
        "USERNAME_EMAIL_EXIST":"Email already exists.",
        "USERNAME_INACTIVE": "You have not authorize user.",
        "USERNAME_NOT_VERIFIED": "You have not verified your username. Please verify",
        "REQUIRED_FIELD":"Fields required",
        "SUCCESSFULLY_REGISTERED":"Successfully registered",
        "SUCCESSFULLY_LOGGEDIN":"Successfully logged in",
        "AUTOLOGIN_SUCCESSFULLY_LOGGEDIN":"Your account has been verified and you are logged in successfully.",
        "WRONG_USERNAME":"Username does not exists",
        "WRONG_PASSWORD":"Password is wrong!",
        "CURRENT_PASSWORD":"Current Password is wrong!",
        "INVALID_USER":"Invalid User. Your email does not exist to our system.",
        "ALREADY_VERIFIED":"You have already verified your email. Please login to website.",
        "DATABASE_ISSUE" : "There is some problem to fetch the record.",
        "DELETE_RECORD" : "Record deleted successfully.",
        "STATUS_CHANGED" : "Status has been changed successfully.",
        "INVALID_STATUS": "Invalid Status",
        "ADDED_SUCCESSFULL" : "Congratulations! User has been added successfully. Login credential has been sent to registered email.",
        "SPACE_NOT_ALLOWED": "Space is not allowed",
        "NOT_FOUND": "Not Found",
        "YOUR_ACCOUNT": "Your account has been",
        "CONTACT_ADMINISTRATOR":"Please contact to Administrator.",
        "SEND_MAIL_ISSUE" : "There is some issue to send email.",
        "MAIL_SENT": "Your request send successfully.",
        "FROM": "from",
        "ERROR_MAIL":"There is some error to send mail to your email id.",
        "LINK_MAIL":"Link for reset password has been sent to your email id.",
        "PASSWORD_CHANGED":"Password has been changed",
        "UNKNOW_ERROR_OCCURRED" : "Unknow Error Occurred",
        "NOT_AUTHORIZED" : "You are not authorized. Please contact to Administrator.",
        "TYPE":"Type is required",

        "CITY_NOT_FOUND":"City not found.",
        "SEARCH_KEYWORD_REQUIRED":"Search keyword required.",        
        "NO_DATA_FOUND":"No data found.",
        "SUCCESSFULLY_EXECUTED":"Successfully executed.",
        'NO_ACCESS':'You are not allowed to edit this product',
        "EMAIL_SEND_SUCCESSFULL" : "Email send successfully to respective group.",
        "FORGOT_PASWORD":"Password changed successfully. Please check your email.",
        "COUNTRY_NOT_FOUND" : "Country not found."
    },

    vehicle:{
        "NAME_REQUIRED":"Name for vehicle type is required.",
        "TYPE_REQUIRED" : "Vehicle type required.",
        "VEHICLE_TYPE_ALREADY_EXIST" : "Vehicle type already exist.",
        "VECHICLE_TYPE_SAVED" : "Vehicle type has ben saved successfully.",
        "VECHICLE_TYPE_UPDATED_CATEGORY": "Vehicle type has been updated successfully.",
        "ISSUE_IN_VEHICLE_TYPE_UPDATE": "There is some issue with updating vehicle type.",
        "VEHICLE_TYPE_NOT_FOUND" : "Vehicle type not found.",

        "VEHICLE_NAME_REQUIRED":"Name for vehicle is required.",
        "VEHICLE_REQUIRED" : "Vehicle required.",
        "VEHICLE_ALREADY_EXIST" : "Vehicle already exist.",
        "VECHICLE_SAVED" : "Vehicle has ben saved successfully.",
        "VECHICLE_UPDATED": "Vehicle has been updated successfully.",
        "ISSUE_IN_VEHICLE_UPDATE": "There is some issue with updating vehicle.",
        "VEHICLE_NOT_FOUND" : "Vehicle not found.",
    },

    energy:{
        "NAME_REQUIRED":"Value for energy of vehicle is required.",
        "ENERGY_VALUE_ALREADY_EXIST" : "This value already exist.",
        "VALUE_SAVED" : "Value of energy has been saved successfully.",
        "ENERGY_VALUE_UPDATED": "Value of power has been updated successfully.",
        "ISSUE_IN_ENERGY_VALUE_UPDATE": "There is some issue with updating value of energy.",
        "ENERGY_VALUE_NOT_FOUND" : "Value of energy not found.",
    },

    cylinder:{
        "NAME_REQUIRED":"Value for cylinder capacity of vehicle is required.",
        "CYLINDER_VALUE_ALREADY_EXIST" : "This value already exist.",
        "VALUE_SAVED" : "Value of cylinder has been saved successfully.",
        "CYLINDER_VALUE_UPDATED": "Value of cylinder has been updated successfully.",
        "ISSUE_IN_CYLINDER_VALUE_UPDATE": "There is some issue with updating value of cylinder.",
        "CYLINDER_VALUE_NOT_FOUND" : "Value oF Cylinder not found.",
        "CYLINDER_NOT_FOUND" : "Cylinder not found.",
    },

    options:{
        "NAME_REQUIRED":" Option of vehicle is required.",
        "OPTIONS_VALUE_ALREADY_EXIST" : "This value already exist.",
        "VALUE_SAVED" : "Option has been saved successfully.",
        "OPTIONS_VALUE_UPDATED": "Option has been updated successfully.",
        "ISSUE_IN_OPTIONS_VALUE_UPDATE": "There is some issue with updating option.",
        "OPTIONS_VALUE_NOT_FOUND" : "Options not found.",
        "OPTIONS_NOT_FOUND" : "Options not found.",
    },

    consumption:{
        "NAME_REQUIRED":" Consumption of vehicle is required.",
        "CONSUMPTION_VALUE_ALREADY_EXIST" : "This value already exist.",
        "VALUE_SAVED" : "Consumption has been saved successfully.",
        "CONSUMPTION_VALUE_UPDATED": "Consumption has been updated successfully.",
        "ISSUE_IN_CONSUMPTION_VALUE_UPDATE": "There is some issue with updating consumption.",
        "CONSUMPTION_VALUE_NOT_FOUND" : "Consumption not found.",
        "CONSUMPTION_NOT_FOUND" : "Consumption not found.",
    },

    mileage:{
        "START_POINT_REQUIRED":" Start range is required.",
        "END_POINT_REQUIRED":" End range is required.",
        "START_VALUE_ALREADY_EXIST" : "This value already exist in start range.",
        "END_VALUE_ALREADY_EXIST" : "This value already exist in end range.",
        "START_END_ALREADY_EXIST" : "Start range with End range already exist",
        "VALUE_SAVED" : "Mileage has been saved successfully.",
        "MILEAGE_VALUE_UPDATED": "Mileage has been updated successfully.",
        "ISSUE_IN_MILEAGE_VALUE_UPDATE": "There is some issue with updating mileage.",
        "MILEAGE_VALUE_NOT_FOUND" : "Mileage not found.",
        "MILEAGE_NOT_FOUND" : "Mileage not found.",
    },

    model:{
        "NAME_REQUIRED":"Model of vehicle is required.",
        "MODEL_VALUE_ALREADY_EXIST" : "This value already exist.",
        "VALUE_SAVED" : "Model of vehicle has been saved successfully.",
        "MODEL_VALUE_UPDATED": "Model of Vehicle has been updated successfully.",
        "ISSUE_IN_MODEL_VALUE_UPDATE": "There is some issue with updating value of vehicle's model.",
        "MODEL_VALUE_NOT_FOUND" : "Value oF vehicle's model not found.",
        "MODEL_NOT_FOUND" : "Vehicle models not found.",
    },

    category:{
        "NAME_REQUIRED":"Category name required.",
        "TYPE_REQUIRED" : "Category type required.",
        "VARIETY_REQUIRED" :"Variety of Category required.",
        "CATEGORY_ALREADY_EXIST" : "Category already exist.",
        "CATEGORY_SAVED" : "Category saved successfully.",
        "UPDATED_CATEGORY": "Category updated successfully.",
        "ISSUE_IN_UPDATE": "There is some issue with updating category.",
    },

    brand:{
        "NAME_REQUIRED":"Brand name required.",
        "MODEL_REQUIRED" : "Brand model required.",
        "BRAND_ALREADY_EXIST" : "Brand already exist.",
        "BRAND_SAVED" : "Brand saved successfully.",
        "UPDATED_BRAND": "Brand updated successfully.",
        "ISSUE_IN_UPDATE": "There is some issue with updating brand.",
        "BRAND_VALUE_NOT_FOUND" : "Brand not found.",
        "BRAND_NOT_FOUND" : "Brand not found.",
    },

    city:{
        "NAME_REQUIRED":"City name required.",
        "SAVED_CITY":"City has been saved successfully.",
        "CITY_ALREADY_EXIST" : "The same city is already saved. Please change the city.",
        "UPDATED_CITY" :"City updated successfully.",
        "CITY_ID_REQUIRED" : "City Id required.",
        "NO_CITY_FOUND" : "There is no city associated with the given ID. Please check and try again.",
        "DELETED_CITY" : "City deleted successfully.",
        "CITY_NOT_FOUND" : "City not found.",
        
    },

    user:{
        "USER_UPDATED" : "User updated successfully.",
        "USER_UPDATION_ISSUE" : "There is some issue to update user."
    },

    blogs: {
        "SAVED_BLOGS" : "Blog saved successfully.",
        "BLOG_ALREADY_EXIST" : "Blog already exists.",
        "DATABASE_ISSUE" : "There is some problem to fetch the blog detail.",
        "UPDATED_BLOG" : "Blog updated successfully.",
        "UPDATED_BLOG_ISSUE" : "There is some issue with updating blog.",
        "NOTHING_TO_UPDATE" : "There is no changes to update.",
        "TITLE_REQUIRED" : "Blog title required.",
        "DESCRIPTION_REQUIRED": "Blog description required.",
        "SAVED_COMMENT": "Comment posted successfully"
    },

    languages: {
        "LANGUAGE_NOT_FOUND" : "Language not found.",
        "ISSUE_ON_LANGUAGE" : "There is some problem on language selection.",
    },
}