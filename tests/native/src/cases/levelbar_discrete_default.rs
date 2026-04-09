use gtk::prelude::*;
use relm4::prelude::*;

pub struct LevelbarDiscreteDefault;

#[relm4::component(pub)]
impl SimpleComponent for LevelbarDiscreteDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::LevelBar {
            set_value: 2.0,
            set_min_value: 0.0,
            set_max_value: 5.0,
            set_mode: gtk::LevelBarMode::Discrete,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
