import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Comment() {

const location = useLocation();
const statessss = location.state
console.log(statessss)

return(
    <>
    </>
)

}

export default Comment;
