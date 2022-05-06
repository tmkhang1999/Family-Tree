# Family-Tree Project Description

# I. Project documents
* [Project's Description](https://docs.google.com/document/d/1_J-YxqUfAiye2thfdJMih6dkBH06cNgN1vjdaecMpJw/edit)
* [Team Contract](https://docs.google.com/document/d/1hPpu90y54hWZjb6TeuELipTG5h0vcJSo85snbG-2tw8/edit)
* [Software Requirements Specification](https://docs.google.com/document/d/1H0Jo7XqYkJiHt3sH_CDAjGq786noJtzT/edit)
* [Gant Chart](https://docs.google.com/document/d/1H0Jo7XqYkJiHt3sH_CDAjGq786noJtzT/edit)
# II. UI Design Ideas
* [Khang Tran](https://www.figma.com/file/Clnk7AaO1CSWeZvhB8M91l/Family-Tree?node-id=0%3A1)
* [Joseph Montalvo](https://www.figma.com/file/c7wQ7DVZuCECJfWvkTurEv/Family-Tree-Login?node-id=0%3A1)
* [Maddie Bauso](https://mbauso.github.io/sapling/)

# III. Installation
## Prerequisites
1. Python >= 3.7.
2. *client ID* and *client secret* from Google.

## Creating a Google Client
The first step to enable a Google Login option is to register your application as a client to Google.

1. You need to have a Google account.
2. Next, go to the <a href="https://console.developers.google.com/apis/credentials">Google developers credentials page</a>.
3. Then, press the Create credentials button on the next page. Select the option for **OAuth client ID**:
![](https://i.imgur.com/sfs2HYk.png)
4. Select the **Web application** option at the top.
![](https://i.imgur.com/lELuj74.png)
5. You can provide a name for the client, and it will be also the name of your web application.
![](https://i.imgur.com/wzN93G7.png)
6. If you want to run the app in localhost, you can set the Authorized JavaScript origins to https://127.0.0.1:5000 and Authorized redirect URIs to https://127.0.0.1:5000/login/callback.
7. Finally, hit Create and take note of the ***client ID*** and ***client secret***.

## Creating App Passwords
In the next step, you need to create app passwords to enable the mailing function. Thus, you should follow the steps in this link
[App passwords](https://support.google.com/accounts/answer/185833?hl=en)

![](https://i.imgur.com/EToYcCG.png)
![](https://i.imgur.com/5xoA7If.png)

Hit Generate and take note of the ***password*** for only your app.

# IV. Getting started
**Step 1:** Clone the repository from terminal `git clone https://github.com/tmkhang1999/Family-Tree.git`. If you use GitHub Desktop, cloning the repository with it will achieve a similar result.

**Step 2:** Create a copy of `.env.example` file, rename it to `.env` and fill in all the required variables as specified in the file. For "SECRET_KEY" and "SECURITY_PASSWORD_SALT", you can type whatever you want.

![](https://i.imgur.com/tdJBQLC.png)

**Step 4:** In the terminal, run `pip install -r requirements.txt`.

**Step 5:** The entry point to interpret the application will be `app.py`, and you can also choose the port you want your app to run on by customizing `app,py`

![](https://i.imgur.com/kKTDIK1.png)

# V. Contributing
Any contributions are more than welcome. Please follow these steps to get your work merged in:

1. Clone the repository.
2. Create a new branch `git checkout -b branch_name` (or create one with GitHub Desktop from the branch view) for your work.
3. Make changes in the code.
4. Open a Pull Request with a comprehensive list of changes.
  
# VI. Built on
This project relies predominantly on:
* [dataset](https://github.com/pudo/dataset)
* [Flask](https://flask.palletsprojects.com/en/2.0.x/)
* [Python](https://www.python.org/) (3.7 or higher)
