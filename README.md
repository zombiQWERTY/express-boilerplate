# Express boilerplate

### Windows
Run cmd as Administrator, then
> ##### Install Chocolatey (Choco) - [https://chocolatey.org](https://chocolatey.org)
```bash
PowerShell
Set-ExecutionPolicy -ExecutionPolicy UNRESTRICTED
iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex
Set-ExecutionPolicy -ExecutionPolicy RESTRICTED
exit
```
##### Install NodeJS - [https://nodejs.org](https://nodejs.org)
```bash
choco install nodejs
```
##### Install Windows build tools (may take long time)
```bash
npm install --global --production windows-build-tools
```
##### Install Yarn - [https://yarnpkg.com](https://yarnpkg.com)
```bash
npm install --global yarn
```
##### Install PM2 - [https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)
```bash
sudo npm install --global pm2
```
##### Install GraphicsMagick - [http://graphicsmagick.org](http://graphicsmagick.org)
```bash
choco install graphicsmagick
```
##### Install MongoDB - [https://mongodb.com](https://mongodb.com)
```bash
choco install mongodb
```
##### Install MongoDB as service
```bash
set PATH=%PATH%;C:\Program Files\MongoDB\Server\3.2\bin
refreshenv
mkdir C:\data\db
mkdir C:\data\log
echo logpath="C:\data\log\mongod.log" > "C:\Program Files\MongoDB\Server\3.2\bin\mongod.cfg"
```
**Replace C:\Program Files\MongoDB\Server\3.2\bin\mongod.cfg file content with:** (underlines is spaces)
```
systemLog:
    ____destination: file
    ____path: c:\data\log\mongod.log
storage:
    ____dbPath: c:\data\db
```
```bash
mongod.exe --config "C:\Program Files\MongoDB\Server\3.2\bin\mongod.cfg" --install
```
Start MongoDB service:
```bash
net start MongoDB
```
Stop MongoDB service:
```bash
net stop MongoDB
```

##### Install dependencies (from root project folder)
```bash
npm install --global nodemon
yarn && cd ./frontend && yarn
```





### Mac OS
> ##### Install Ruby - [https://www.ruby-lang.org](https://www.ruby-lang.org)
```bash
\curl -sSL https://get.rvm.io | bash -s stable
rvm 2.4.0
rvm use 2.4.0
```
##### Install HomeBrew (Brew) - [http://brew.sh](http://brew.sh)
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
##### Install NodeJS - [https://nodejs.org](https://nodejs.org)
```bash
brew install node
```
##### Install Yarn - [https://yarnpkg.com](https://yarnpkg.com)
```bash
sudo npm install --global yarn
```
##### Install PM2 - [https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)
```bash
sudo npm install --global pm2
```
##### Install Python - [https://www.python.org](https://www.python.org)
```bash
brew install python
```
##### Install GraphicsMagick - [http://graphicsmagick.org](http://graphicsmagick.org)
```bash
brew install graphicsmagick
```
##### Install MongoDB - [https://mongodb.com](https://mongodb.com)
```bash
brew install mongodb
```

##### Install dependencies (from root project folder)
```bash
yarn && cd ./frontend && yarn
```





### Linux Ubuntu
##### Install LinuxBrew (Brew) - [http://linuxbrew.sh](http://linuxbrew.sh)
```bash
sudo apt-get install build-essential curl git python-setuptools ruby
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install)"
export PATH="$HOME/.linuxbrew/bin:$PATH"
export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
sudo apt-get install linuxbrew-wrapper
```
##### Install NodeJS - [https://nodejs.org](https://nodejs.org):
```bash
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs
```
##### Install Yarn - [https://yarnpkg.com](https://yarnpkg.com)
```bash
sudo npm install --global yarn
```
##### Install PM2 - [https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)
```bash
sudo npm install --global pm2
```
##### Install GraphicsMagick - [http://graphicsmagick.org](http://graphicsmagick.org)
```bash
brew install graphicsmagick
```
##### Install MongoDB - [https://mongodb.com](https://mongodb.com)
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo mkdir /data
sudo mkdir /data/db
```

##### Install dependencies (from root project folder)
```bash
yarn && cd ./frontend && yarn
```





### Cent OS 7
>##### Install dependencies
```bash
sudo yum update -y
sudo yum groupinstall -y 'Development Tools'
sudo yum install curl wget -y
```
##### Install NodeJS - [https://nodejs.org](https://nodejs.org)
```bash
sudo yum install -y nodejs
sudo npm install --global n
sudo n stable
reboot
```
##### Install Yarn - [https://yarnpkg.com](https://yarnpkg.com)
```bash
sudo npm install --global yarn
```
##### Install PM2 - [https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)
```bash
sudo npm install --global pm2
```
##### Install GraphicsMagick - [http://graphicsmagick.org](http://graphicsmagick.org)
```bash
yum install epel-release -y
yum install GraphicsMagick -y
```
##### Install MongoDB - [https://mongodb.com](https://mongodb.com)
```bash
sudo vi /etc/yum.repos.d/mongodb-org.repo
```
Insert there:
```bash
[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc
```
Then
```bash
sudo yum install -y mongodb-org
```

##### Install dependencies (from root project folder)
```bash
yarn && cd ./frontend && yarn
```



#### Start app on Pre-Production (and Production) server (before you need to run mongod service):
```bash
yarn startProd
```



------------------

#### ApiDoc
```bash
yarn apidoc
```

#### Testing (Mocha + Chai + SuperTest)
```bash
yarn test
```

#### Developing (before you need to run mongod service)
```bash
yarn dev
cd ./frontend && yarn dev
```

#### Production (before you need to run mongod service)
```bash
yarn startProd
```
