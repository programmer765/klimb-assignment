This is a simple node js based application which lets user uploads the data in the mongodb database.

Working of the app - 

1) It takes the user data in a xlsx or xls file

2) It then parses the file and remove any kind of data duplication.

3) All the data are unique which is checked using email ids of each person in the data.

4) Data is stored in the database using async.eachseries which iterates the data asynchronously.

5) At first data is stored locally then it is parsed into array of json using xlsx module of npm.

Thank You.