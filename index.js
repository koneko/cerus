'use strict';

let page = localStorage.page
let content = document.getElementById('content')
var currentRole = null
var statusList = {
    "immune": "🛡️",
    "inactive": "💤",
    "passed": "✔️",
    "failed": "❌"
}

if(!localStorage.page) {
    localStorage.page = "overview"
}

function check() {
    let overview = document.getElementById('overview')
    let members = document.getElementById('members')
    let roles = document.getElementById('roles')
    let settings = document.getElementById('settings')
    let hidebtn = document.getElementById('hidebtn')

    if(page == 'overview') {
        overview.classList.add('active')
        overviewPage()
    } else if (page == "roles") {
        roles.classList.add('active')
        clearPage()
        rolesPage()
    } else if (page == "members") {
        members.classList.add('active')
        clearPage()
        membersPage()
    } else if (page == "settings") {
        settings.classList.add('active')
        clearPage()
        settingsPage()
    } else if(page == "share") {
        hidebtn.classList.add('active')
        clearPage()
        sharePage()
    }
}

function swap(page) {
    localStorage.page = page
    location.reload()
}

function find() {
    let box = document.getElementById('search').value
}

function clearPage() {
    content.innerHTML = ""
}

function overviewPage() {
    if(!localStorage.members || !localStorage.roles) {
        content.innerHTML = '<p class="text-muted">No members or roles found, please create them.</p>'
        return
    }
    let roles = JSON.parse(localStorage.roles)
    let members = JSON.parse(localStorage.members)
    content.innerHTML = `
    <div style="display:flex; margin-bottom: 10px;">
    <div style="width: 100px;"><b>Rank</b></div>
    <div style="width: 150px;"><b>Username</b></div>
    <div style="width: 60px;"><b>Points</b></div>
    <div style="margin-left:29px;"><b>Supervisions</b></div>
    <div style="margin-left: 35px;"><b>Strikes</b></div>
    <div style="margin-left: 50px;"><b>Status</b></div>
    </div>
    `
    for (let roleindex = 0; roleindex < roles.length; roleindex++) {
        let rolename = roles[roleindex].name
        var filter = members.filter((member) => { 
            return member.role == rolename
        });
        filter.forEach(member => {
            let role = roles.find(v => v.name == member.role)
            let div = document.createElement('div')
            let memberstatus = null
            if(member.status == "failed") {
                memberstatus = statusList.failed
            } else if(member.status == "passed") {
                memberstatus = statusList.passed
            } else if(member.status == "inactive") {
                memberstatus = statusList.inactive
            } else {
                memberstatus = statusList.immune
            }
            div.style.display = "flex"
            div.style.marginBottom = "19.5px"
            div.style.marginTop = "19.5px"
            div.removeAttribute("tabIndex");
            div.innerHTML = `
            <div style="width: 100px;"><span style="color:${role.color};">${role.name}</span></div>
            <div style="width: 150px;"><span>${member.name}</span></div>
            <div style="width: 60x;"><span style="margin-right: 10px;"><i class="fa-solid fa-plus" style="color:lightgreen; cursor: pointer;" onclick="addPoint('${member.name}')"></i></span><b>${member.points}</b><i class="fa-solid fa-minus" style="color:red; margin-left:10px; cursor: pointer;" onclick="removePoint('${member.name}')"></i></div>
            <div style="margin-left:50px;"><span style="margin-right: 10px;"><i class="fa-solid fa-plus" style="color:lightgreen; cursor: pointer;" onclick="addSupPoint('${member.name}')"></i></span><b>${member.supervisions}</b><i class="fa-solid fa-minus" style="color:red; margin-left:10px; cursor: pointer;" onclick="removeSupPoint('${member.name}')"></i></div>
            <div style="margin-left:50px;"><span style="margin-right: 10px;"><i class="fa-solid fa-plus" style="color:lightgreen; cursor: pointer;" onclick="addStrike('${member.name}')"></i></span><b>${member.strikes}</b><i class="fa-solid fa-minus" style="color:red; margin-left:10px; cursor: pointer;" onclick="removeStrike('${member.name}')"></i></div>
            <div style="margin-left:60px;"><span>${memberstatus}</span></div>
            
            `
            content.appendChild(div)
        });
    }

}

function rolesPage() {
    content.style.textAlign = "center"
    content.innerHTML = `
    <h1>Role creation</h1><br>
    <input placeholder="Name..." id="rolename">
    <br><br>
    <input placeholder="Points to pass quota..." id="pointsToPass">
    <br><br>
    <input type="color" id="rolecolor">
    <br><br><button class="btn btn-primary" onclick="createRole()">Create</button>
    <br><br><br>
    <div class="bg-light p-3 rounded w-100 hidden" id="roles-content">
    </div>
    `
    if(localStorage.roles) {
        let roles = JSON.parse(localStorage.roles)
        let content = document.getElementById('roles-content')
        content.classList.remove('bg-light')
        content.classList.add('bg-white')
        roles.forEach(role => {
            let div = document.createElement('div')
            div.innerHTML = `<br>
            <p><span style="color:${role.color}">${role.name}</span> | <i class="fa-solid fa-user-group"></i> ${role.assignedTo} | Quota: <b>${role.pointsToPass}</b> | <i class="fa-solid fa-xmark" style="color:red; cursor: pointer; " onclick="deleteRole('${role.name}')"></i></p>
            `
            content.appendChild(div)
        });

    }
}

function membersPage() {
    if(!localStorage.roles) return content.innerHTML = '<p class="text-muted">No roles found, please create one.</p>'
    let roles = JSON.parse(localStorage.roles)
    if(!localStorage.members) {
        let json = []
        localStorage.members = JSON.stringify(json)
    }
    let members = JSON.parse(localStorage.members)
    content.style.textAlign = "center"
    content.innerHTML = `
    <h1>Member creation</h1><br>
    <input placeholder="Username..." id="username"><br><br>
    <div class="dropdown">
        <button onclick="myFunction()" class="dropbtn">Roles</button>
        <div id="myDropdown" class="dropdown-content">
        </div>
    </div>
    <br><br><button class="btn btn-primary" onclick="createMember()">Create</button><br><br><br>
    <div class="bg-white p-3 rounded w-100 hidden" id="member-content">
    </div>
    `
    roles.forEach(role => {
        let a = document.createElement('a')
        a.href = "#"
        a.setAttribute('onclick', `setCurrentRole('${role.name}')`)
        a.innerHTML = `<span style="color:${role.color}">${role.name}</span>`
        let dropdown = document.getElementById('myDropdown')
        dropdown.appendChild(a)
    });
    
    members.forEach(member => {
        let div = document.createElement('div')
        let role = roles.find(v => v.name == member.role)
        div.innerHTML = `<br>
        <p><span style="color:${role.color}">${role.name}</span> ${member.name} | <i class="fa-solid fa-xmark" style="color:red; cursor: pointer; " onclick="deleteMember('${member.name}')"></i></p>
        `
        let cnt = document.getElementById('member-content').appendChild(div)
        
    });
}

function settingsPage() {
    content.style.textAlign = "center"
    content.innerHTML = `
    <input placeholder="Username..." id="usernamestatus"><br><br>
    <input placeholder="Status..." id="status"><br><br>
    <button class="btn btn-outline-success" onclick="changeStatus()">set status</button><br><br>
    <button class="btn btn-outline-danger" onclick="deleted('members')">Delete Members</button>
    <button class="btn btn-outline-danger" onclick="deleted('roles')">Delete Roles</button>
    `
}



function sharePage() {
    if(!localStorage.members || !localStorage.roles) {
        content.innerHTML = '<p class="text-muted">No members or roles found, please create them.</p>'
        return
    }
    let roles = JSON.parse(localStorage.roles)
    let members = JSON.parse(localStorage.members)
    content.innerHTML = `
    <div style="display:flex; margin-bottom: 10px;">
    <div style="width: 100px;"><b>Rank</b></div>
    <div style="width: 150px;"><b>Username</b></div>
    <div style="width: 60px;"><b>Points</b></div>
    <div style="margin-left:29px;"><b>Supervisions</b></div>
    <div style="margin-left: 35px;"><b>Strikes</b></div>
    <div style="margin-left: 50px;"><b>Status</b></div>
    </div>
    `
    for (let roleindex = 0; roleindex < roles.length; roleindex++) {
        let rolename = roles[roleindex].name
        var filter = members.filter((member) => { 
            return member.role == rolename
        });
        filter.forEach(member => {
            let role = roles.find(v => v.name == member.role)
            let div = document.createElement('div')
            let memberstatus = null
            if(member.status == "failed") {
                memberstatus = statusList.failed
            } else if(member.status == "passed") {
                memberstatus = statusList.passed
            } else if(member.status == "inactive") {
                memberstatus = statusList.inactive
            } else {
                memberstatus = statusList.immune
            }
            div.style.display = "flex"
            div.style.marginBottom = "19.5px"
            div.style.marginTop = "19.5px"
            div.removeAttribute("tabIndex");
            div.innerHTML = `
            <div style="width: 100px;"><span style="color:${role.color};">${role.name}</span></div>
            <div style="width: 150px;"><span>${member.name}</span></div>
            <div style="width: 70x; margin-left: 10px;"><span style="margin-right: 10px;"></span><b>${member.points}</b></div>
            <div style="margin-left:90px;"><span style="margin-right: 10px;"></span><b>${member.supervisions}</b></div>
            <div style="margin-left:85px;"><span style="margin-right: 10px;"></span><b>${member.strikes}</b></div>
            <div style="margin-left:90px;"><span>${memberstatus}</span></div>
            
            `
            content.appendChild(div)
        });
    }

}


function createRole() {
    if(!localStorage.roles) {
        let json = []
        localStorage.roles = JSON.stringify(json)
    }
    let roles = JSON.parse(localStorage.roles)
    let name = document.getElementById('rolename').value
    let color = document.getElementById('rolecolor').value
    let pointsToPass = document.getElementById('pointsToPass').value
    let role = {
        "name": name,
        "color": color,
        "assignedTo": 0,
        "pointsToPass": +pointsToPass
    }
    roles.push(role)
    localStorage.roles = JSON.stringify(roles)
    location.reload()
}

function deleteRole(name) {
    let roles = JSON.parse(localStorage.roles)
    var filter = roles.filter((role) => { 
        return role.name != name
    });
    let newroles = JSON.stringify(filter)
    localStorage.roles = newroles
    location.reload()
}

function createMember() {
    if(!localStorage.members) {
        let json = []
        localStorage.members = JSON.stringify(json)
    }
    if(!localStorage.currentRole) {
        return alert('select a role to give this user')
    }
    let members = JSON.parse(localStorage.members)
    let roles = JSON.parse(localStorage.roles)
    let name = document.getElementById('username').value
    let rank = currentRole
    let entry = {
        "name" : name,
        "role": rank,
        "points": 0,
        "supervisions": 0,
        "strikes": 0,
        "status": "failed"
    }
    members.push(entry)
    let memrole = roles.find(v => v.name == rank)
    memrole.assignedTo = memrole.assignedTo + 1
    localStorage.members =JSON.stringify(members)
    localStorage.roles =JSON.stringify(roles)
    location.reload()
}

function deleteMember(name) {
    let members = JSON.parse(localStorage.members)
    let roles = JSON.parse(localStorage.roles)
    var filter = members.filter((member) => { 
        return member.name != name
    });
    let newroles = JSON.stringify(filter)
    let member = members.find(v => v.name == name)
    let memrole = roles.find(v => v.name == member.role)
    memrole.assignedTo = memrole.assignedTo - 1
    localStorage.members = newroles
    localStorage.roles =JSON.stringify(roles)
    location.reload()
}

function deleted(thing) {
    if(thing == "members") {
        localStorage.removeItem("members")
    } else {
        localStorage.removeItem("roles")
    }
}

function setCurrentRole(name) {
    currentRole = name
}

function addPoint(name) {
    let members = JSON.parse(localStorage.members)
    let roles = JSON.parse(localStorage.roles)
    let member = members.find(v => v.name == name)
    let role = roles.find(v => v.name == member.role)
    member.points = member.points + 1
    let total = member.points + member.supervisions
    if(total >= role.pointsToPass && member.status != "immune") {
        member.status = "passed"
    }
    localStorage.members = JSON.stringify(members)
    location.reload()
}

function addStrike(name) {
    let members = JSON.parse(localStorage.members)
    let member = members.find(v => v.name == name)
    member.strikes = member.strikes + 1
    localStorage.members = JSON.stringify(members)
    location.reload()
}


function addSupPoint(name) {
    let members = JSON.parse(localStorage.members)
    let roles = JSON.parse(localStorage.roles)
    let member = members.find(v => v.name == name)
    let role = roles.find(v => v.name == member.role)
    member.supervisions = member.supervisions + 0.5
    let total = member.points + member.supervisions
    if(total >= role.pointsToPass && member.status != "immune") {
        member.status = "passed"
    }
    localStorage.members = JSON.stringify(members)
    location.reload()
}

function removePoint(name) {
    let members = JSON.parse(localStorage.members)
    let roles = JSON.parse(localStorage.roles)
    let member = members.find(v => v.name == name)
    let role = roles.find(v => v.name == member.role)
    member.points = member.points - 1
    let total = member.points + member.supervisions
    if(total < role.pointsToPass && member.status != "immune") {
        member.status = "failed"
    }
    localStorage.members = JSON.stringify(members)
    location.reload()
}

function removeSupPoint(name) {
    let members = JSON.parse(localStorage.members)
    let roles = JSON.parse(localStorage.roles)
    let member = members.find(v => v.name == name)
    let role = roles.find(v => v.name == member.role)
    member.supervisions = member.supervisions - 0.5
    let total = member.points + member.supervisions
    if(total < role.pointsToPass && member.status != "immune") {
        member.status = "failed"
    }
    localStorage.members = JSON.stringify(members)
    location.reload()
}

function removeStrike(name) {
    let members = JSON.parse(localStorage.members)
    let member = members.find(v => v.name == name)
    member.strikes = member.strikes - 1
    localStorage.members = JSON.stringify(members)
    location.reload()
}


function changeStatus() {
    let status = document.getElementById('status').value
    let name = document.getElementById('usernamestatus').value
    let members = JSON.parse(localStorage.members)
    let member = members.find(v => v.name == name)
    member.status = status
    localStorage.members = JSON.stringify(members)
    location.reload()
}

function shareCode() {
    let data = {
        roles: JSON.parse(localStorage.roles),
        members: JSON.parse(localStorage.members)
    }
    let encrypted = btoa(JSON.stringify(data))
    let p = document.createElement('p')
    p.innerHTML = `Sharing URL: /share?code=${encrypted}` 
    content.appendChild(p)
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


check()