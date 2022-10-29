import React from 'react';
import './GetPic.css';

/* user icons */
import { ReactComponent as Usr1 } from '../../icons/usr1.svg';
import { ReactComponent as Usr2 } from '../../icons/usr2.svg';
import { ReactComponent as Usr3 } from '../../icons/usr3.svg';
import { ReactComponent as Usr4 } from '../../icons/usr4.svg';
import { ReactComponent as Usr5 } from '../../icons/usr5.svg';
import { ReactComponent as Usr6 } from '../../icons/usr6.svg';
import { ReactComponent as Usr7 } from '../../icons/usr7.svg';
import { ReactComponent as Gal1 } from '../../icons/woman1.svg';
import { ReactComponent as Gal2 } from '../../icons/woman2.svg';
import { ReactComponent as Gal3 } from '../../icons/woman3.svg';
import { ReactComponent as Gal4 } from '../../icons/woman4.svg';

const Icons = {
  1: <Usr1 className="pic"/>,
  2: <Usr2 className="pic"/>,
  3: <Usr3 className="pic"/>,
  4: <Usr4 className="pic"/>,
  5: <Usr5 className="pic"/>,
  6: <Usr6 className="pic"/>,
  7: <Usr7 className="pic"/>,
  8: <Gal1 className="pic"/>,
  9: <Gal2 className="pic"/>,
  10: <Gal3 className="pic"/>,
  11: <Gal4 className="pic"/>,
};

/* return random icon for users */
const GetIcon = (num) => {
  return Icons[num];
}

export { GetIcon };
