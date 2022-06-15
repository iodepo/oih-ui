export default function Expert({expert}) {
    return (
        <div id="expertDetails">
            <h6>Expert: <a href={expert['id']}>{expert['name']}</a></h6>
            <p><b>Job Title:</b> {expert['txt_jobTitle']}</p>
            <p><b>Knows About:</b> {expert['txt_knowsAbout']}</p>
            <p><b>Language:</b> {expert['txt_knowsLanguage']}</p>
            <p><b>Text Nationality:</b> {expert['txt_nationality']}</p>
        </div>
    )
}