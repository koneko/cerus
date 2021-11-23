const params = new URLSearchParams(window.location.search)

var membersraw = atob(params.get('members'))
var rolesraw = atob(params.get('roles'))
var content = document.getElementById('content')
var statusList = {
    "immune": "🛡️",
    "inactive": "💤",
    "passed": "✔️",
    "failed": "❌"
}

function sharePage() {
    let roles = JSON.parse(rolesraw)
    let members = JSON.parse(membersraw)
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

sharePage()
