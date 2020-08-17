import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Router from 'next/router';
import React, { useState } from 'react';

type Props = {
  options: any[];
  children: React.ReactNode;
};
const MenuWithLinks = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { options, children } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        aria-controls={anchorEl ? 'simple-menu' : null}
        aria-haspopup="true"
        onClick={handleClick}
        onKeyPress={handleClick}
      >
        {children}
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, i) =>
          option.separator ? (
            <hr style={{ width: '85%', margin: '10px auto' }} key={`separated-${i}`} />
          ) : (
            <MenuItem
              onClick={() => {
                Router.push(option.href, option.as || option.href);
                handleClose();
              }}
              key={option.href}
              style={{
                fontWeight: 300,
                fontSize: '14px',
              }}
            >
              {option.text}
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
};

export default MenuWithLinks;
