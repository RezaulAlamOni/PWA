                            <?php

                            if (isset($_POST['submit'])){
                                $to         ='rezaul.oni@gmail.com';
//                                $sub        =wordwrap($_REQUEST['subject'],80);
                                $sub        =$_REQUEST['subject'];
                                $sub        =$_REQUEST['name'];
                                $body       =$_REQUEST['message'];
                                $header     =$sub."  From: ".$_REQUEST['email'];
                                mail($to,$sub,$body,$header);
                                header("Location:index.php");
                            }
