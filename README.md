
##Required
<table>
  <tr>
    <td>PostgreSQL</td>
    <td>http://www.postgresql.org/download/</td>
  </tr>
  <tr>
    <td>Node</td>
    <td>https://nodejs.org/en/download/package-manager/</td>
  </tr>
</table>



Clone the project from the repository  

```	
	$git clone https://github.com/Geocent/iqms
```


Change directory to project  

```	
$cd iqms
```


Install node dependencies via npm  

```	
$npm install 
```

Set up psql in separate terminal  

```
	$ psql
	$ ALTER USER postgres WITH PASSWORD '1233456';
	$ CREATE DATABASE iqms_development;  
```

To start: back in /iqms  

```
	$ chmod +x bin/www_test
	$cd bin
	$ ./www_test
```	

To open app: from a browser, go to  

```
	http://localhost:3000/static/www/
```	

###Notes:

bin/www is daemonized, bin/www_test is not  
tests can be ran with `$ mocha`


###Hunter’s Notes
To load new models:  
Close test  
Modify models  
Delete database (DROP DATABASE ‘name’;)  
Create Database (CREATE DATABASE ‘name’;)  
Open test  

To check database  

```
/l (lists databases)
/c <name> (connects to database <name>)
/dt (lists all tables in connected database)
/d <table> (displays columns of <table> in connected database)
```
