const { profile } = require("console");
const { fstat } = require("fs");
const inquirer = require("inquirer");
const { generate } = require("rxjs");
// const fs = require("fs");
// const generatePage = require("./src/page-template")

// const pageHTML = generatePage(name, github);
 
// fs.writeFile("./index.html", pageHTML, err => {
//     if (err) throw err;

//     console.log("Portfolio Complete! Check out index.html to see the output!");
// });

const promptUser = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is your name? (Required)",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter your name!")
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "github", 
            message: "Enter your GitHub Username (Required)",
            validate: gitHubUsername => {
                if (gitHubUsername) {
                    return true
                } else {
                    console.log("Please enter your GitHub Username!")
                }
            }
        },
        {
            type: "confirm",
            name: "confirmAbout",
            message: "Would you like to enter some information about yourself for an 'About' section?",
            default: true
        },
        {
            type: "input", 
            name: "about", 
            message: "Provide some information about yourself",
            when: ({confirmAbout }) => {
                if (confirmAbout) {
                    return true
                } else {
                    return false;
                }
            }
        }
    ]);
};

const promptProject = portfolioData => {
    console.log(`
    =================
    Add a New Project
    =================
    `);
    if (!portfolioData.projects) {
        portfolioData.projects = [];
    }
    return inquirer.prompt([
    {
        type: "input", 
        name: "name",
        message: "What is the name of your project?",
        validate: projectName => {
            if (projectName) {
                return true
            } else {
                console.log("Please enter your project's name!")
            }
        }
    },
    {
        type: "input",
        name: "description",
        message: "Provide a description of the project (Required)",
        validate: projectDescription => {
            if (projectDescription) {
                return true
            } else {
                console.log("Please enter a project description!")
            }
        }
    },
    {
        type: "checkbox",
        name: "languages",
        message: "What did you build this project with? (Check all that apply)",
        choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
    },
    {
        type: "input",
        name: "link",
        message:"Enter the GitHub link to your project. (Required)",
        validate: projectLink => {
            if (projectLink) {
                return true
            } else {
                console.log("Please provide project link")
            }
        }
    },
    {
        type: "confirm",
        name: "feature",
        message: "Would you like to feature this project?",
        default: false
    },
    {
        type: "confirm",
        name: "confirmAddProject",
        message: "Would you like to enter another projects?",
        default: false
    }
    
    ])
    .then(projectData => {
        portfolioData.projects.push(projectData);
        if (projectData.confirmAddProject) {
            return promptProject(portfolioData);
        } else {
            return portfolioData;
        }
    })
    
};

promptUser()
.then(promptProject)
.then(portfolioData => {
    console.log(portfolioData);
    const pageHTML = generatePage(portfolioData);
    fs.writeFile("./index.html", pageHTML, err => {
        if (err) throw new Error(err);
        console.log("Page created! check out index.html in this directory to see it!")
    })
})


